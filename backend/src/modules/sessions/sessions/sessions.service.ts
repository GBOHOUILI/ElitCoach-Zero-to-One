import {
  Injectable, NotFoundException, ConflictException,
  ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateSessionDto, CompleteSessionDto, CancelSessionDto, CreateReviewDto } from '../dto/create-session.dto';

@Injectable()
export class SessionsService {
  private stripe: any;

  constructor(private prisma: PrismaService) {
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('changeme')) {
      const Stripe = require('stripe');
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
  }

  // B-010 — Disponibilités coach
  async setAvailability(userId: string, slots: any[]) {
    const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
    if (!coach) throw new NotFoundException('Profil coach introuvable.');

    await this.prisma.$transaction([
      this.prisma.availability.deleteMany({ where: { coachId: coach.id } }),
      this.prisma.availability.createMany({
        data: slots.map(s => ({
          coachId: coach.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      }),
    ]);

    return { message: 'Disponibilités enregistrées.', count: slots.length };
  }

  async getCoachAvailability(coachId: string, week?: string) {
    const coach = await this.prisma.coachProfile.findFirst({
      where: { OR: [{ id: coachId }, { slug: coachId }] },
    });
    if (!coach) throw new NotFoundException('Coach introuvable.');

    const slots = await this.prisma.availability.findMany({
      where: { coachId: coach.id, isActive: true },
    });

    if (!week) return { slots };

    const weekStart = new Date(week);
    const confirmedSessions = await this.prisma.session.findMany({
      where: {
        coachId: coach.id,
        status: { in: ['CONFIRMED', 'PENDING'] },
        scheduledAt: {
          gte: weekStart,
          lt: new Date(weekStart.getTime() + 7 * 24 * 3600 * 1000),
        },
      },
    });

    const bookedTimes = confirmedSessions.map(s => s.scheduledAt.toISOString());

    const result = slots.map(slot => {
      const date = new Date(weekStart);
      const diff = (slot.dayOfWeek - weekStart.getDay() + 7) % 7;
      date.setDate(date.getDate() + diff);
      const dateStr = date.toISOString().split('T')[0];
      const slotDateTime = `${dateStr}T${slot.startTime}:00.000Z`;
      return {
        date: dateStr,
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: !bookedTimes.some(t => t.startsWith(dateStr) && t.includes(slot.startTime)),
      };
    });

    return { week, slots: result };
  }

  // B-011 — Créer réservation
  async createSession(clientUserId: string, dto: CreateSessionDto) {
    const clientProfile = await this.prisma.clientProfile.findUnique({ where: { userId: clientUserId } });
    if (!clientProfile) throw new ForbiddenException('Profil client introuvable.');
    if (clientProfile.status !== 'APPROVED') throw new ForbiddenException('Votre candidature doit être approuvée.');

    const coach = await this.prisma.coachProfile.findUnique({ where: { id: dto.coachId } });
    if (!coach) throw new NotFoundException('Coach introuvable.');
    if (!coach.hourlyRate) throw new BadRequestException('Ce coach n\'a pas de tarif défini.');

    const scheduledAt = new Date(dto.scheduledAt);
    const durationMins = dto.durationMins || 60;
    const existing = await this.prisma.session.findFirst({
      where: {
        coachId: dto.coachId,
        scheduledAt,
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
    });
    if (existing) throw new ConflictException('Ce créneau n\'est plus disponible.');

    const price = Math.round(coach.hourlyRate * (durationMins / 60));
    const priceInCents = price * 100;

    let stripeClientSecret: string | null = null;
    let paymentIntentId: string | null = null;

    if (this.stripe) {
      const pi = await this.stripe.paymentIntents.create({
        amount: priceInCents,
        currency: 'eur',
        capture_method: 'manual',
        metadata: { coachId: dto.coachId, clientId: clientProfile.id },
      });
      stripeClientSecret = pi.client_secret;
      paymentIntentId = pi.id;
    }

    const session = await this.prisma.session.create({
      data: {
        coachId: dto.coachId,
        clientId: clientProfile.id,
        scheduledAt,
        durationMins,
        status: 'PENDING',
        price,
        stripePaymentIntentId: paymentIntentId,
      },
    });

    if (this.stripe && paymentIntentId) {
      await this.stripe.paymentIntents.update(paymentIntentId, {
        metadata: { coachId: dto.coachId, clientId: clientProfile.id, sessionId: session.id },
      });
    }

    return { sessionId: session.id, stripeClientSecret, amount: priceInCents, currency: 'eur', price };
  }

  // B-012 — Webhook Stripe
  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    if (!this.stripe) return { received: true };

    let event: any;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
      throw new BadRequestException('Signature Stripe invalide.');
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const sessionId = pi.metadata?.sessionId;
      if (sessionId) {
        const zoomLink = `https://zoom.us/j/${Math.floor(Math.random() * 9000000000) + 1000000000}`;
        await this.prisma.session.update({
          where: { id: sessionId },
          data: { status: 'CONFIRMED', zoomLink },
        });
        console.log(`[Stripe] Session ${sessionId} confirmée — Zoom: ${zoomLink}`);
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      const sessionId = pi.metadata?.sessionId;
      if (sessionId) {
        await this.prisma.session.update({
          where: { id: sessionId },
          data: { status: 'CANCELLED', cancelReason: 'Paiement échoué.' },
        });
      }
    }

    return { received: true };
  }

  // B-013 — Annuler session
  async cancelSession(userId: string, sessionId: string, dto: CancelSessionDto) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { coach: true, client: true },
    });
    if (!session) throw new NotFoundException('Session introuvable.');

    const coachProfile = await this.prisma.coachProfile.findUnique({ where: { userId } });
    const clientProfile = await this.prisma.clientProfile.findUnique({ where: { userId } });

    const isOwner = coachProfile?.id === session.coachId || clientProfile?.id === session.clientId;
    if (!isOwner) throw new ForbiddenException('Non autorisé.');

    const hoursUntil = (session.scheduledAt.getTime() - Date.now()) / 3600000;
    let refundRatio = 0;
    if (hoursUntil > 24) refundRatio = 1.0;
    else if (hoursUntil > 4) refundRatio = 0.5;

    let refundAmount = 0;
    if (refundRatio > 0 && this.stripe && session.stripePaymentIntentId) {
      refundAmount = Math.floor(session.price * refundRatio * 100);
      try {
        await this.stripe.refunds.create({
          payment_intent: session.stripePaymentIntentId,
          amount: refundAmount,
        });
      } catch (e) {
        console.error('[Stripe] Refund error:', e.message);
      }
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { status: 'CANCELLED', cancelReason: dto.cancelReason, cancelledBy: userId },
    });

    return { message: 'Session annulée.', refundAmount: refundAmount / 100, refundRatio };
  }

  // B-014 — Compléter session
  async completeSession(userId: string, sessionId: string, dto: CompleteSessionDto) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session introuvable.');

    const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
    if (!coach || coach.id !== session.coachId) throw new ForbiddenException('Non autorisé.');
    if (session.status !== 'CONFIRMED') throw new BadRequestException('La session doit être confirmée.');

    if (this.stripe && session.stripePaymentIntentId) {
      try {
        await this.stripe.paymentIntents.capture(session.stripePaymentIntentId);
      } catch (e) {
        console.error('[Stripe] Capture error:', e.message);
      }
    }

    const commission = Math.round(session.price * 0.17);
    const coachRevenue = session.price - commission;

    const updated = await this.prisma.session.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED', coachNotes: dto.coachNotes },
    });

    console.log(`[Session] ${sessionId} complétée — Commission: ${commission}€ / Coach: ${coachRevenue}€`);
    return { ...updated, commission, coachRevenue };
  }

  // B-015 — Mes sessions
  async getMySessions(userId: string, role: string, status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (role === 'COACH') {
      const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
      if (!coach) throw new NotFoundException();
      where.coachId = coach.id;
    } else {
      const client = await this.prisma.clientProfile.findUnique({ where: { userId } });
      if (!client) throw new NotFoundException();
      where.clientId = client.id;
    }

    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.session.findMany({
        where, skip, take: limit,
        orderBy: { scheduledAt: 'desc' },
        include: {
          coach: { select: { firstName: true, lastName: true, photoUrl: true, hourlyRate: true } },
          client: { select: { firstName: true, lastName: true } },
          review: true,
        },
      }),
      this.prisma.session.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  // B-023 — Créer avis
  async createReview(clientUserId: string, sessionId: string, dto: CreateReviewDto) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId }, include: { review: true } });
    if (!session) throw new NotFoundException('Session introuvable.');

    const client = await this.prisma.clientProfile.findUnique({ where: { userId: clientUserId } });
    if (!client || client.id !== session.clientId) throw new ForbiddenException('Non autorisé.');
    if (session.status !== 'COMPLETED') throw new BadRequestException('La session doit être terminée.');
    if (session.review) throw new ConflictException('Un avis existe déjà pour cette session.');

    const review = await this.prisma.review.create({
      data: {
        sessionId,
        coachId: session.coachId,
        clientId: client.id,
        rating: dto.rating,
        comment: dto.comment,
        listening: dto.listening,
        methodology: dto.methodology,
        results: dto.results,
        punctuality: dto.punctuality,
      },
    });

    // Recalculer score coach
    const reviews = await this.prisma.review.findMany({ where: { coachId: session.coachId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.prisma.coachProfile.update({
      where: { id: session.coachId },
      data: { score: Math.round(avgRating * 200) },
    });

    return review;
  }
}
