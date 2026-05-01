import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { UpdateCoachDto } from '../dto/update-coach.dto';

@Injectable()
export class CoachesService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const profile = await this.prisma.coachProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true, emailVerified: true } },
        availability: true,
      },
    });
    if (!profile) throw new NotFoundException('Profil coach introuvable.');
    return profile;
  }

  async updateMyProfile(userId: string, dto: UpdateCoachDto) {
    return this.prisma.coachProfile.update({ where: { userId }, data: dto });
  }

  async setAvailability(userId: string, slots: any[]) {
    const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
    if (!coach) throw new NotFoundException();
    await this.prisma.$transaction([
      this.prisma.availability.deleteMany({ where: { coachId: coach.id } }),
      this.prisma.availability.createMany({
        data: slots.map(s => ({ coachId: coach.id, ...s })),
      }),
    ]);
    return { message: 'Disponibilités enregistrées.', count: slots.length };
  }

  async getMyAvailability(userId: string) {
    const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
    if (!coach) throw new NotFoundException();
    return this.prisma.availability.findMany({ where: { coachId: coach.id, isActive: true } });
  }

  async getPublicAvailability(coachId: string, week?: string) {
    const coach = await this.prisma.coachProfile.findFirst({
      where: { OR: [{ id: coachId }, { slug: coachId }], status: 'APPROVED' },
    });
    if (!coach) throw new NotFoundException('Coach introuvable.');

    const slots = await this.prisma.availability.findMany({
      where: { coachId: coach.id, isActive: true },
    });

    if (!week) return { slots };

    const weekStart = new Date(week);
    const booked = await this.prisma.session.findMany({
      where: {
        coachId: coach.id,
        status: { in: ['CONFIRMED', 'PENDING'] },
        scheduledAt: {
          gte: weekStart,
          lt: new Date(weekStart.getTime() + 7 * 24 * 3600 * 1000),
        },
      },
    });

    const bookedDates = booked.map(s => s.scheduledAt.toISOString());
    const result = slots.map(slot => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + ((slot.dayOfWeek - weekStart.getDay() + 7) % 7));
      const dateStr = date.toISOString().split('T')[0];
      return {
        date: dateStr,
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: !bookedDates.some(t => t.startsWith(dateStr) && t.includes(slot.startTime)),
      };
    });

    return { week, slots: result };
  }

  async getPublicProfile(idOrSlug: string) {
    const coach = await this.prisma.coachProfile.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], status: 'APPROVED' },
      include: { user: { select: { email: false, emailVerified: false, createdAt: true } } },
    });
    if (!coach) throw new NotFoundException('Coach introuvable.');

    const reviews = await this.prisma.review.findMany({
      where: { coachId: coach.id },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const avgRating = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

    return { ...coach, reviews, avgRating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length };
  }

  async listPublicCoaches(specialty?: string, minRate?: number, maxRate?: number, page = 1, limit = 12) {
    const where: any = { status: 'APPROVED' };
    if (specialty) where.specialties = { has: specialty };
    if (minRate || maxRate) where.hourlyRate = {};
    if (minRate) where.hourlyRate.gte = minRate;
    if (maxRate) where.hourlyRate.lte = maxRate;

    const [data, total] = await Promise.all([
      this.prisma.coachProfile.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { score: 'desc' },
      }),
      this.prisma.coachProfile.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getSuggestedCoaches(clientUserId: string) {
    const client = await this.prisma.clientProfile.findUnique({ where: { userId: clientUserId } });
    if (!client || !client.objective) return { coaches: [] };

    const stopwords = ['je', 'mon', 'ma', 'les', 'des', 'une', 'un', 'et', 'en', 'de', 'du', 'la', 'le', 'pour', 'avec', 'dans'];
    const keywords = client.objective
      .toLowerCase().split(/\s+/)
      .filter(w => w.length > 3 && !stopwords.includes(w));

    const coaches = await this.prisma.coachProfile.findMany({
      where: { status: 'APPROVED' },
      orderBy: { score: 'desc' },
      take: 20,
    });

    const scored = coaches.map(c => {
      const matchCount = c.specialties.filter(s =>
        keywords.some(k => s.toLowerCase().includes(k))
      ).length;
      return { coach: c, matchScore: Math.min(matchCount * 30, 100) };
    }).filter(c => c.matchScore > 0).slice(0, 5);

    return { coaches: scored };
  }
}
