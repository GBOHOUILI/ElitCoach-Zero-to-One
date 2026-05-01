import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterCoachDto } from '../dto/register-coach.dto';
import { RegisterClientDto } from '../dto/register-client.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshDto } from '../dto/refresh.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/coach')
  @ApiOperation({ summary: 'B-002 — Inscription coach (candidature)' })
  @ApiResponse({ status: 201, description: 'Candidature soumise, email de vérification envoyé.' })
  @ApiResponse({ status: 400, description: 'Email déjà utilisé ou validation DTO échouée.' })
  registerCoach(@Body() dto: RegisterCoachDto) {
    return this.authService.registerCoach(dto);
  }

  @Post('register/client')
  @ApiOperation({ summary: 'B-003 — Inscription client avec scoring automatique' })
  @ApiResponse({ status: 201, description: 'Résultat scoring : PENDING ou REJECTED.' })
  registerClient(@Body() dto: RegisterClientDto) {
    return this.authService.registerClient(dto);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'B-004 — Vérification email via token' })
  @ApiResponse({ status: 200, description: 'Email vérifié.' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expiré.' })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('login')
  @ApiOperation({ summary: 'B-005 — Login (accessToken 15min + refreshToken 7j)' })
  @ApiResponse({ status: 200, description: 'Tokens + infos user.' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  @ApiResponse({ status: 403, description: 'Email non vérifié.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'B-006 — Refresh accessToken' })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }
}
