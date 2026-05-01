import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId },
      include: { user: { select: { email: true, emailVerified: true } } },
    });

    if (!profile) throw new NotFoundException('Profil client introuvable.');
    return profile;
  }

  async getMyDashboard(userId: string) {
    const client = await this.prisma.clientProfile.findUnique({
      where: { userId }
    });

    if (!client) throw new NotFoundException('Profil client introuvable.');

    const now = new Date();

    const [goals, sessions, nextSession] = await Promise.all([
      this.prisma.goal.findMany({
        where: { clientId: client.id, status: 'ACTIVE' },
        include: { steps: true }
      }),

      this.prisma.session.findMany({
        where: { clientId: client.id, status: 'COMPLETED' }
      }),

      this.prisma.session.findFirst({
        where: {
          clientId: client.id,
          status: 'CONFIRMED',
          scheduledAt: { gte: now }
        },
        include: {
          coach: { select: { firstName: true, lastName: true, photoUrl: true } }
        },
        orderBy: { scheduledAt: 'asc' },
      }),
    ]);

    return {
      profile: {
        firstName: client.firstName,
        lastName: client.lastName,
        status: client.status
      },
      activeGoals: goals.length,
      avgProgress: goals.length
        ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
        : 0,
      sessionsCompleted: sessions.length,
      nextSession,
      totalSpent: sessions.reduce((s, x) => s + (x.price || 0), 0),
    };
  }
}
