import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../../common/decorators/auth.guard';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-007 — Mon profil client' })
  getMe(@CurrentUser('userId') userId: string) {
    return this.clientsService.getMyProfile(userId);
  }
}
