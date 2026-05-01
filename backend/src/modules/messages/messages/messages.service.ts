import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

const BYPASS_PATTERN = /([0-9]{2}[\s.\-]{0,1}){4,}|@[a-zA-Z]|\+33|\b07\b|\b06\b/;

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateConversation(coachId: string, clientId: string) {
    try {
      return await this.prisma.conversation.create({ data: { coachId, clientId } });
    } catch {
      return this.prisma.conversation.findUnique({ where: { coachId_clientId: { coachId, clientId } } });
    }
  }

  async getMyConversations(userId: string, role: string) {
    if (role === 'COACH') {
      const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
      if (!coach) throw new NotFoundException();
      const convs = await this.prisma.conversation.findMany({
        where: { coachId: coach.id },
        include: {
          client: { select: { firstName: true, lastName: true, photoUrl: false } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      });
      return convs.map(c => ({
        ...c,
        unreadCount: 0,
        otherPerson: { ...c.client, role: 'CLIENT' },
      }));
    } else {
      const client = await this.prisma.clientProfile.findUnique({ where: { userId } });
      if (!client) throw new NotFoundException();
      const convs = await this.prisma.conversation.findMany({
        where: { clientId: client.id },
        include: {
          coach: { select: { firstName: true, lastName: true, photoUrl: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      });
      return convs.map(c => ({
        ...c,
        unreadCount: 0,
        otherPerson: { ...c.coach, role: 'COACH' },
      }));
    }
  }

  async getMessages(conversationId: string, userId: string, role: string, page = 1) {
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation introuvable.');

    const coach = role === 'COACH' ? await this.prisma.coachProfile.findUnique({ where: { userId } }) : null;
    const client = role === 'CLIENT' ? await this.prisma.clientProfile.findUnique({ where: { userId } }) : null;

    const isParticipant = (coach && coach.id === conv.coachId) || (client && client.id === conv.clientId);
    if (!isParticipant) throw new ForbiddenException('Non autorisé.');

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * 50,
      take: 50,
    });

    await this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, isRead: false },
      data: { isRead: true },
    });

    return { messages, conversationId };
  }

  async sendMessage(conversationId: string, userId: string, role: string, content: string) {
    // Anti-bypass
    if (BYPASS_PATTERN.test(content)) {
      const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
      await this.prisma.alert.create({
        data: {
          type: 'BYPASS_ATTEMPT',
          userId,
          conversationId,
          blockedContent: content.substring(0, 200),
          detectedPattern: content.match(BYPASS_PATTERN)?.[0] || '',
        },
      });
      throw new BadRequestException('Les coordonnées personnelles ne sont pas autorisées sur cette plateforme.');
    }

    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException();

    const message = await this.prisma.message.create({
      data: { conversationId, senderId: userId, content },
    });

    return message;
  }

  async createConversation(coachId: string, clientId: string) {
    return this.getOrCreateConversation(coachId, clientId);
  }

  async getAlerts(page = 1) {
    const [data, total] = await Promise.all([
      this.prisma.alert.findMany({
        where: { isResolved: false },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * 20,
        take: 20,
      }),
      this.prisma.alert.count({ where: { isResolved: false } }),
    ]);
    return { data, total };
  }

  async resolveAlert(alertId: string) {
    return this.prisma.alert.update({ where: { id: alertId }, data: { isResolved: true } });
  }
}
