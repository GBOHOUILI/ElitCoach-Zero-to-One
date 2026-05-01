import { Module } from '@nestjs/common';
import { GoalsService } from './goals/goals.service';
import { GoalsController } from './goals/goals.controller';

@Module({
  providers: [GoalsService],
  controllers: [GoalsController],
})
export class GoalsModule {}
