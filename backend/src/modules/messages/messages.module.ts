import { Module } from '@nestjs/common';
import { MessagesService } from './messages/messages.service';
import { MessagesController } from './messages/messages.controller';

@Module({
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
