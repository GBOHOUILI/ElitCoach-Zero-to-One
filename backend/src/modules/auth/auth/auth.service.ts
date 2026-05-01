import {
  Injectable, BadRequestException, UnauthorizedException, ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { RegisterCoachDto } from '../dto/register-coach.dto';
import { RegisterClientDto } from '../dto/register-client.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // ─── B-002 : Inscription Coach ────────────────────────
  async registerCoach(dto: RegisterCoachDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Cet email est déjà utilisé.');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: 'COACH',
        coachProfile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            bio: dto.bio,
            specialties: dto.specialties,
            certifications: dto.certifications,
            yearsExperience: dto.yearsExperience,
            hourlyRate: dto.hourlyRate,
            videoUrl: dto.videoUrl,
            status: 'PENDING',
          },
        },
      },
    });

    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });

    // TODO S-007 : envoi email Brevo avec lien /verify-email?token=
    console.log(`[DEV] Verify email link: http://localhost:3000/verify-email?token=${token}`);

    return { message: 'Candidature soumise. Vérifiez votre email.', userId: user.id };
  }

  // ─── B-003 : Inscription Client avec scoring ──────────
  async registerClient(dto: RegisterClientDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Cet email est déjà utilisé.');

    // Scoring automatique — 4 critères × 25 pts
    let score = 0;
    if (dto.objective.length > 50) score += 25;
    if (dto.hoursPerWeek >= 2) score += 25;
    if (dto.budget >= 200) score += 25;
    if (dto.hadCoachBefore && dto.previousCoachResult && dto.previousCoachResult.length > 10) score += 25;

    const status = score >= 60 ? 'PENDING' : 'REJECTED';

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: 'CLIENT',
        clientProfile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            objective: dto.objective,
            budget: dto.budget,
            hoursPerWeek: dto.hoursPerWeek,
            hadCoachBefore: dto.hadCoachBefore,
            previousCoachResult: dto.previousCoachResult,
            whyNow: dto.whyNow,
            qualifyScore: score,
            status: status as any,
          },
        },
      },
    });

    const message = status === 'REJECTED'
      ? 'Après analyse, le coaching ne semble pas la bonne étape pour vous en ce moment.'
      : 'Votre candidature est en cours d\'analyse. Réponse sous 48h.';

    // TODO S-007 : email Brevo selon status
    console.log(`[DEV] Client ${dto.email} — score: ${score} → ${status}`);

    return { message, score, status };
  }

  // ─── B-004 : Vérification Email ───────────────────────
  async verifyEmail(token: string) {
    const record = await this.prisma.emailVerification.findUnique({ where: { token } });
    if (!record) throw new BadRequestException('Token invalide.');
    if (record.expiresAt < new Date()) throw new BadRequestException('Token expiré.');

    await this.prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    });
    await this.prisma.emailVerification.delete({ where: { token } });

    return { message: 'Email vérifié avec succès.' };
  }

  // ─── B-005 : Login ────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Identifiants invalides.');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Identifiants invalides.');

    if (!user.emailVerified) throw new ForbiddenException('Email non vérifié. Consultez votre boîte mail.');

    const payload = { userId: user.id, role: user.role };
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Récupérer firstName selon le rôle
    let firstName = '';
    if (user.role === 'COACH') {
      const p = await this.prisma.coachProfile.findUnique({ where: { userId: user.id } });
      firstName = p?.firstName || '';
    } else if (user.role === 'CLIENT') {
      const p = await this.prisma.clientProfile.findUnique({ where: { userId: user.id } });
      firstName = p?.firstName || '';
    }

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role, firstName, status: user.status },
    };
  }

  // ─── B-006 : Refresh Token ────────────────────────────
  async refresh(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalide.');
    }

    const record = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!record) throw new UnauthorizedException('Refresh token révoqué.');

    const accessToken = this.jwt.sign(
      { userId: payload.userId, role: payload.role },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    return { accessToken };
  }
}
