import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev_secret_change_in_prod_use_32chars_minimum',
    });
  }

  async validate(payload: { userId: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, suspended: true, status: true },
    });

    if (!user) throw new UnauthorizedException('Utilisateur introuvable');
    if (user.suspended) throw new UnauthorizedException('Compte suspendu');

    return { userId: user.id, email: user.email, role: user.role };
  }
}
