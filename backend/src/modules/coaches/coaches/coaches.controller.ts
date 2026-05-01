import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CoachesService } from './coaches.service';
import { UpdateCoachDto } from '../dto/update-coach.dto';
import { SetAvailabilityDto } from '../dto/availability.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../../common/decorators/auth.guard';

@ApiTags('Coaches')
@Controller('coaches')
export class CoachesController {
  constructor(private coachesService: CoachesService) {}

  @Get()
  @ApiOperation({ summary: 'B-026 — Liste coachs publics avec filtres' })
  @ApiQuery({ name: 'specialty', required: false })
  @ApiQuery({ name: 'minRate', required: false, type: Number })
  @ApiQuery({ name: 'maxRate', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  listCoaches(
    @Query('specialty') specialty?: string,
    @Query('minRate', new DefaultValuePipe(0), ParseIntPipe) minRate = 0,
    @Query('maxRate', new DefaultValuePipe(0), ParseIntPipe) maxRate = 0,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return this.coachesService.listPublicCoaches(specialty, minRate || undefined, maxRate || undefined, page);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COACH')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-007 — Mon profil coach' })
  getMe(@CurrentUser('userId') userId: string) {
    return this.coachesService.getMyProfile(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COACH')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-007 — Mettre à jour mon profil' })
  updateMe(@CurrentUser('userId') userId: string, @Body() dto: UpdateCoachDto) {
    return this.coachesService.updateMyProfile(userId, dto);
  }

  @Post('me/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COACH')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-010 — Enregistrer mes disponibilités' })
  setAvailability(@CurrentUser('userId') userId: string, @Body() dto: SetAvailabilityDto) {
    return this.coachesService.setAvailability(userId, dto.slots);
  }

  @Get('me/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COACH')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-010 — Mes disponibilités' })
  getMyAvailability(@CurrentUser('userId') userId: string) {
    return this.coachesService.getMyAvailability(userId);
  }

  @Get('suggested')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-026 — Coachs suggérés selon objectif client' })
  getSuggested(@CurrentUser('userId') userId: string) {
    return this.coachesService.getSuggestedCoaches(userId);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'B-010 — Disponibilités coach pour une semaine' })
  @ApiQuery({ name: 'week', required: false, description: 'YYYY-MM-DD (lundi de la semaine)' })
  getAvailability(@Param('id') id: string, @Query('week') week?: string) {
    return this.coachesService.getPublicAvailability(id, week);
  }

  @Get(':id')
  @ApiOperation({ summary: 'B-026 — Profil public coach' })
  getPublic(@Param('id') id: string) {
    return this.coachesService.getPublicProfile(id);
  }
}


// ─── Dashboard endpoints ───────────────────────────────────

import { DashboardService } from './dashboard.service';
