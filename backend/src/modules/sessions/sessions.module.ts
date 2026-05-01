import { Module } from '@nestjs/common';
import { SessionsService } from './sessions/sessions.service';
import { SessionsController } from './sessions/sessions.controller';

@Module({
  providers: [SessionsService],
  controllers: [SessionsController],
  exports: [SessionsService],
})
export class SessionsModule {}
