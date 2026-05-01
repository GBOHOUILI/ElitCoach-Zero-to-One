import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateStepDto, UpdateProgressDto, CreateCheckInDto, UpdateCheckInDto } from '../dto/goal.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../../common/decorators/auth.guard';

@ApiTags('Goals')
@Controller('goals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post()
  @UseGuards(RolesGuard) @Roles('COACH')
  @ApiOperation({ summary: 'B-021 — Créer un objectif (coach)' })
  createGoal(@CurrentUser('userId') userId: string, @Body() dto: CreateGoalDto) {
    return this.goalsService.createGoal(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'B-021 — Mes objectifs' })
  getGoals(
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.goalsService.getGoals(userId, role, clientId);
  }

  @Patch(':goalId/steps/:stepId')
  @ApiOperation({ summary: 'B-021 — Compléter une étape' })
  updateStep(
    @CurrentUser('userId') userId: string,
    @Param('goalId') goalId: string,
    @Param('stepId') stepId: string,
    @Body() dto: UpdateStepDto,
  ) {
    return this.goalsService.updateStep(userId, goalId, stepId, dto);
  }

  @Patch(':goalId/progress')
  @UseGuards(RolesGuard) @Roles('COACH')
  @ApiOperation({ summary: 'B-021 — Modifier progression (coach)' })
  updateProgress(
    @CurrentUser('userId') userId: string,
    @Param('goalId') goalId: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.goalsService.updateProgress(userId, goalId, dto);
  }

  @Post(':goalId/checkins')
  @UseGuards(RolesGuard) @Roles('CLIENT')
  @ApiOperation({ summary: 'B-021 — Soumettre check-in hebdomadaire (client)' })
  createCheckIn(
    @CurrentUser('userId') userId: string,
    @Param('goalId') goalId: string,
    @Body() dto: CreateCheckInDto,
  ) {
    return this.goalsService.createCheckIn(userId, goalId, dto);
  }

  @Patch(':goalId/checkins/:checkInId')
  @UseGuards(RolesGuard) @Roles('COACH')
  @ApiOperation({ summary: 'B-021 — Note coach sur check-in' })
  updateCheckIn(
    @CurrentUser('userId') userId: string,
    @Param('goalId') goalId: string,
    @Param('checkInId') checkInId: string,
    @Body() dto: UpdateCheckInDto,
  ) {
    return this.goalsService.updateCheckIn(userId, goalId, checkInId, dto);
  }
}
