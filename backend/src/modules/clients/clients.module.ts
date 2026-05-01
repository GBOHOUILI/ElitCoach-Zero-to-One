import { Module } from '@nestjs/common';
import { ClientsService } from './clients/clients.service';
import { ClientsController } from './clients/clients.controller';

@Module({
  providers: [ClientsService],
  controllers: [ClientsController],
})
export class ClientsModule {}
