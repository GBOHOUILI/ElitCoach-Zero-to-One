import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getCoachDashboard(userId: string) {
    const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
    if (!coach) throw new NotFoundException();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [sessionsThisMonth, sessionsLastMonth, upcomingSessions, allSessions, reviews, goals] = await Promise.all([
      this.prisma.session.findMany({ where: { coachId: coach.id, status: 'COMPLETED', scheduledAt: { gte: startOfMonth } } }),
      this.prisma.session.findMany({ where: { coachId: coach.id, status: 'COMPLETED', scheduledAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
      this.prisma.session.findMany({
        where: { coachId: coach.id, status: 'CONFIRMED', scheduledAt: { gte: now } },
        include: { client: { select: { firstName: true, lastName: true } } },
        orderBy: { scheduledAt: 'asc' }, take: 3,
      }),
      this.prisma.session.findMany({ where: { coachId: coach.id, status: 'COMPLETED' } }),
      this.prisma.review.findMany({ where: { coachId: coach.id } }),
      this.prisma.goal.findMany({ where: { coachId: coach.id } }),
    ]);

    const revenue = { currentMonth: sessionsThisMonth.reduce((s, x) => s + x.price * 0.83, 0), lastMonth: sessionsLastMonth.reduce((s, x) => s + x.price * 0.83, 0), total: allSessions.reduce((s, x) => s + x.price * 0.83, 0) };
    const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    const goalsCompleted = goals.filter(g => g.status === 'COMPLETED').length;

    // Score crédibilité
    const credibilityScore = Math.round(
      (avgRating / 5) * 400 +
      (goalsCompleted / Math.max(goals.length, 1)) * 300 +
      Math.min(sessionsThisMonth.length / 10 * 200, 200) +
      Math.min((new Date().getFullYear() - 2024) * 100, 100)
    );

    // Chart 6 mois
    const revenueChart = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const monthSessions = allSessions.filter(s => s.scheduledAt >= start && s.scheduledAt < end);
      return { month: start.toISOString().substring(0, 7), amount: Math.round(monthSessions.reduce((s, x) => s + x.price * 0.83, 0)) };
    });

    return { revenue, sessions: { thisMonth: sessionsThisMonth.length, upcoming: upcomingSessions, completionRate: allSessions.length > 0 ? Math.round(allSessions.length / (allSessions.length + 1) * 100) : 0 }, rating: { average: Math.round(avgRating * 10) / 10, total: reviews.length }, credibilityScore, revenueChart };
  }

  async getClientDashboard(userId: string) {
    const client = await this.prisma.clientProfile.findUnique({ where: { userId } });
    if (!client) throw new NotFoundException();

    const now = new Date();
    const [goals, sessions, nextSession] = await Promise.all([
      this.prisma.goal.findMany({ where: { clientId: client.id, status: 'ACTIVE' }, include: { steps: true } }),
      this.prisma.session.findMany({ where: { clientId: client.id, status: 'COMPLETED' } }),
      this.prisma.session.findFirst({
        where: { clientId: client.id, status: 'CONFIRMED', scheduledAt: { gte: now } },
        include: { coach: { select: { firstName: true, lastName: true, photoUrl: true } } },
        orderBy: { scheduledAt: 'asc' },
      }),
    ]);

    const totalSpent = sessions.reduce((s, x) => s + x.price, 0);
    const avgProgress = goals.length ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length) : 0;

    return { activeGoals: goals.length, avgProgress, sessionsCompleted: sessions.length, nextSession, totalSpent };
  }

  async getAdminDashboard() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalCoaches, approvedCoaches, totalClients, approvedClients, sessionsThisMonth, sessionsLastMonth, allSessions, reviews, alerts, pendingCoaches, pendingClients] = await Promise.all([
      this.prisma.coachProfile.count(),
      this.prisma.coachProfile.count({ where: { status: 'APPROVED' } }),
      this.prisma.clientProfile.count(),
      this.prisma.clientProfile.count({ where: { status: 'APPROVED' } }),
      this.prisma.session.findMany({ where: { status: 'COMPLETED', scheduledAt: { gte: startOfMonth } } }),
      this.prisma.session.findMany({ where: { status: 'COMPLETED', scheduledAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
      this.prisma.session.findMany({ where: { status: 'COMPLETED' } }),
      this.prisma.review.findMany(),
      this.prisma.alert.count({ where: { isResolved: false } }),
      this.prisma.coachProfile.count({ where: { status: 'PENDING' } }),
      this.prisma.clientProfile.count({ where: { status: 'PENDING' } }),
    ]);

    const mrr = Math.round(sessionsThisMonth.reduce((s, x) => s + x.price * 0.17, 0));
    const mrrLast = Math.round(sessionsLastMonth.reduce((s, x) => s + x.price * 0.17, 0));
    const mrrGrowth = mrrLast > 0 ? Math.round((mrr - mrrLast) / mrrLast * 100) : 0;
    const nps = reviews.length ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10 : 0;

    const revenueChart = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const s = allSessions.filter(x => x.scheduledAt >= start && x.scheduledAt < end);
      return { month: start.toISOString().substring(0, 7), revenue: s.reduce((a, x) => a + x.price, 0), commission: Math.round(s.reduce((a, x) => a + x.price * 0.17, 0)) };
    });

    return { mrr, mrrGrowth, totalCoaches, approvedCoaches, totalClients, approvedClients, sessionsThisMonth: sessionsThisMonth.length, nps, alerts, pendingCoaches, pendingClients, revenueChart, coachAcceptanceRate: totalCoaches > 0 ? Math.round(approvedCoaches / totalCoaches * 100) : 0, clientAcceptanceRate: totalClients > 0 ? Math.round(approvedClients / totalClients * 100) : 0 };
  }
}
