import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateGoalDto, UpdateStepDto, UpdateProgressDto, CreateCheckInDto, UpdateCheckInDto } from '../dto/goal.dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async createGoal(coachUserId: string, dto: CreateGoalDto) {
    const coach = await this.prisma.coachProfile.findUnique({ where: { userId: coachUserId } });
    if (!coach) throw new NotFoundException('Profil coach introuvable.');

    const goal = await this.prisma.goal.create({
      data: {
        coachId: coach.id,
        clientId: dto.clientId,
        title: dto.title,
        description: dto.description,
        targetDate: new Date(dto.targetDate),
        steps: {
          create: dto.steps.map(s => ({
            title: s.title,
            dueDate: s.dueDate ? new Date(s.dueDate) : undefined,
            order: s.order,
          })),
        },
      },
      include: { steps: true },
    });

    return goal;
  }

  async getGoals(userId: string, role: string, clientId?: string) {
    if (role === 'COACH') {
      const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
      if (!coach) throw new NotFoundException();
      return this.prisma.goal.findMany({
        where: { coachId: coach.id, ...(clientId ? { clientId } : {}) },
        include: { steps: true, checkIns: { orderBy: { createdAt: 'desc' }, take: 3 } },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      const client = await this.prisma.clientProfile.findUnique({ where: { userId } });
      if (!client) throw new NotFoundException();
      return this.prisma.goal.findMany({
        where: { clientId: client.id },
        include: { steps: true, checkIns: { orderBy: { createdAt: 'desc' }, take: 3 } },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  async updateStep(userId: string, goalId: string, stepId: string, dto: UpdateStepDto) {
    const goal = await this.prisma.goal.findUnique({ where: { id: goalId }, include: { steps: true } });
    if (!goal) throw new NotFoundException();

    await this.prisma.goalStep.update({
      where: { id: stepId },
      data: { isCompleted: dto.isCompleted, completedAt: dto.isCompleted ? new Date() : null },
    });

    const steps = await this.prisma.goalStep.findMany({ where: { goalId } });
    const completed = steps.filter(s => s.isCompleted).length;
    const progress = Math.round((completed / steps.length) * 100);
    const status = completed === steps.length ? 'COMPLETED' : 'ACTIVE';

    return this.prisma.goal.update({
      where: { id: goalId },
      data: { progress, status: status as any },
      include: { steps: true },
    });
  }

  async updateProgress(coachUserId: string, goalId: string, dto: UpdateProgressDto) {
    const goal = await this.prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal) throw new NotFoundException();
    return this.prisma.goal.update({ where: { id: goalId }, data: { progress: dto.progress } });
  }

  async createCheckIn(clientUserId: string, goalId: string, dto: CreateCheckInDto) {
    const client = await this.prisma.clientProfile.findUnique({ where: { userId: clientUserId } });
    if (!client) throw new NotFoundException();
    const goal = await this.prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal || goal.clientId !== client.id) throw new ForbiddenException();

    return this.prisma.checkIn.create({
      data: { goalId, clientId: client.id, answers: dto.answers },
    });
  }

  async updateCheckIn(coachUserId: string, goalId: string, checkInId: string, dto: UpdateCheckInDto) {
    const coach = await this.prisma.coachProfile.findUnique({ where: { userId: coachUserId } });
    if (!coach) throw new NotFoundException();
    return this.prisma.checkIn.update({
      where: { id: checkInId },
      data: { coachNote: dto.coachNote },
    });
  }
}
