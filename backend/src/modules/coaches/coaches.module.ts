import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CoachesService } from './coaches/coaches.service';
import { CoachesController } from './coaches/coaches.controller';
import { DashboardService } from './coaches/dashboard.service';
import { UploadController } from './coaches/upload.controller';

@Module({
  imports: [
    MulterModule.register({ storage: memoryStorage() }),
  ],
  providers: [CoachesService, DashboardService],
  controllers: [CoachesController, UploadController],
  exports: [CoachesService, DashboardService],
})
export class CoachesModule {}
