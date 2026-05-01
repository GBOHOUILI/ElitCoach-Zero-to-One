import {
  Controller, Post, Get, Delete, Patch, Body, Param, Query, UseGuards,
  DefaultValuePipe, ParseIntPipe,
  Headers, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto, CompleteSessionDto, CancelSessionDto, CreateReviewDto } from '../dto/create-session.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../../common/decorators/auth.guard';
import { Request } from 'express';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-011 — Créer réservation (Stripe pre-auth)' })
  createSession(@CurrentUser('userId') userId: string, @Body() dto: CreateSessionDto) {
    return this.sessionsService.createSession(userId, dto);
  }

  @Post('webhook/stripe')
  @ApiOperation({ summary: 'B-012 — Webhook Stripe' })
  handleWebhook(@Req() req: Request, @Headers('stripe-signature') sig: string) {
    return this.sessionsService.handleStripeWebhook(req.body, sig);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-015 — Mes sessions' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  getMySessions(
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: string,
    @Query('status') status?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return this.sessionsService.getMySessions(userId, role, status, page);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-013 — Annuler session' })
  cancelSession(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: CancelSessionDto,
  ) {
    return this.sessionsService.cancelSession(userId, id, dto);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COACH')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-014 — Compléter session + commission 17%' })
  completeSession(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: CompleteSessionDto,
  ) {
    return this.sessionsService.completeSession(userId, id, dto);
  }

  @Post(':id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-023 — Laisser un avis' })
  createReview(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.sessionsService.createReview(userId, id, dto);
  }
}
