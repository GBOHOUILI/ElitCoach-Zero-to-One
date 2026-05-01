import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  private stripe: any;

  constructor(private prisma: PrismaService) {
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('changeme')) {
      const Stripe = require('stripe');
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
  }

  async listCoaches(status?: string, page = 1, limit = 20) {
    const where = status ? { status: status as any } : {};
    const [data, total] = await Promise.all([
      this.prisma.coachProfile.findMany({ where, include: { user: { select: { email: true, emailVerified: true, createdAt: true } } }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.coachProfile.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async changeCoachStatus(id: string, status: string, note?: string) {
    const profile = await this.prisma.coachProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Coach introuvable.');
    return this.prisma.coachProfile.update({
      where: { id },
      data: { status: status as any, isVerified: status === 'APPROVED' },
    });
  }

  async listClients(status?: string, page = 1, limit = 20) {
    const where = status ? { status: status as any } : {};
    const [data, total] = await Promise.all([
      this.prisma.clientProfile.findMany({ where, include: { user: { select: { email: true, emailVerified: true, createdAt: true } } }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.clientProfile.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async changeClientStatus(id: string, status: string, note?: string) {
    const profile = await this.prisma.clientProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Client introuvable.');
    return this.prisma.clientProfile.update({ where: { id }, data: { status: status as any } });
  }

  async listSessions(status?: string, page = 1, limit = 20) {
    const where = status ? { status: status as any } : {};
    const [data, total] = await Promise.all([
      this.prisma.session.findMany({
        where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          coach: { select: { firstName: true, lastName: true } },
          client: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.session.count({ where }),
    ]);
    const enriched = data.map(s => ({ ...s, commission: Math.round(s.price * 0.17), coachRevenue: Math.round(s.price * 0.83) }));
    return { data: enriched, total, page, limit };
  }

  async getAlerts(page = 1) {
    const [data, total] = await Promise.all([
      this.prisma.alert.findMany({ where: { isResolved: false }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * 20, take: 20 }),
      this.prisma.alert.count({ where: { isResolved: false } }),
    ]);
    return { data, total };
  }

  async suspendUser(userId: string, reason: string, days: number) {
    const suspendedUntil = new Date(Date.now() + days * 24 * 3600 * 1000);
    await this.prisma.user.update({ where: { id: userId }, data: { suspended: true, suspendedUntil } });

    // Annuler sessions futures
    const userCoach = await this.prisma.coachProfile.findUnique({ where: { userId } });
    const userClient = await this.prisma.clientProfile.findUnique({ where: { userId } });
    const where = userCoach ? { coachId: userCoach.id } : userClient ? { clientId: userClient.id } : null;

    if (where) {
      const sessions = await this.prisma.session.findMany({ where: { ...where, status: { in: ['CONFIRMED', 'PENDING'] }, scheduledAt: { gte: new Date() } } });
      for (const s of sessions) {
        if (this.stripe && s.stripePaymentIntentId) {
          try { await this.stripe.refunds.create({ payment_intent: s.stripePaymentIntentId }); } catch {}
        }
        await this.prisma.session.update({ where: { id: s.id }, data: { status: 'CANCELLED', cancelReason: 'Compte suspendu' } });
      }
    }

    return { message: `Utilisateur suspendu jusqu'au ${suspendedUntil.toLocaleDateString('fr-FR')}`, reason };
  }

  async banUser(userId: string, reason: string) {
    const anonEmail = `anon_${userId}@deleted.com`;
    await this.prisma.user.update({
      where: { id: userId },
      data: { email: anonEmail, status: 'BANNED', suspended: true },
    });
    const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
    const client = await this.prisma.clientProfile.findUnique({ where: { userId } });
    if (coach) await this.prisma.coachProfile.update({ where: { userId }, data: { firstName: 'Anonymisé', lastName: '' } });
    if (client) await this.prisma.clientProfile.update({ where: { userId }, data: { firstName: 'Anonymisé', lastName: '' } });
    return { message: 'Utilisateur banni et anonymisé (RGPD).' };
  }

  async getFinance(period: string) {
    const [year, month] = period.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const sessions = await this.prisma.session.findMany({
      where: { status: 'COMPLETED', scheduledAt: { gte: start, lt: end } },
      include: { coach: { select: { firstName: true, lastName: true } } },
    });
    const grossRevenue = sessions.reduce((s, x) => s + x.price, 0);
    const commissions = Math.round(grossRevenue * 0.17);
    const coachPayouts = Math.round(grossRevenue * 0.83);

    const byCoach: Record<string, any> = {};
    for (const s of sessions) {
      const key = s.coachId;
      if (!byCoach[key]) byCoach[key] = { coachId: key, name: `${s.coach.firstName} ${s.coach.lastName}`, sessions: 0, revenue: 0, payout: 0 };
      byCoach[key].sessions++;
      byCoach[key].revenue += s.price;
      byCoach[key].payout += Math.round(s.price * 0.83);
    }

    return { period, grossRevenue, commissions, coachPayouts, sessionsByCoach: Object.values(byCoach).sort((a: any, b: any) => b.revenue - a.revenue) };
  }
}
