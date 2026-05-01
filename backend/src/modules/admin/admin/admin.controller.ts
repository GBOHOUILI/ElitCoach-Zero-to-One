import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ChangeCoachStatusDto, ChangeClientStatusDto } from '../dto/change-status.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../common/decorators/auth.guard';

class SuspendDto { @ApiProperty() @IsString() reason: string; @ApiProperty() @IsInt() days: number; }
class BanDto { @ApiProperty() @IsString() reason: string; }

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth('JWT')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('coaches') @ApiOperation({ summary: 'A-001 — Liste coaches' }) @ApiQuery({ name: 'status', required: false }) @ApiQuery({ name: 'page', required: false })
  listCoaches(@Query('status') status?: string, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1) {
    return this.adminService.listCoaches(status, page);
  }

  @Patch('coaches/:id/status') @ApiOperation({ summary: 'A-002 — Changer statut coach' })
  changeCoachStatus(@Param('id') id: string, @Body() dto: ChangeCoachStatusDto) {
    return this.adminService.changeCoachStatus(id, dto.status, dto.note);
  }

  @Get('clients') @ApiOperation({ summary: 'A-003 — Liste clients' }) @ApiQuery({ name: 'status', required: false })
  listClients(@Query('status') status?: string, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1) {
    return this.adminService.listClients(status, page);
  }

  @Patch('clients/:id/status') @ApiOperation({ summary: 'A-003 — Changer statut client' })
  changeClientStatus(@Param('id') id: string, @Body() dto: ChangeClientStatusDto) {
    return this.adminService.changeClientStatus(id, dto.status, dto.note);
  }

  @Get('sessions') @ApiOperation({ summary: 'A-006 — Liste sessions' }) @ApiQuery({ name: 'status', required: false })
  listSessions(@Query('status') status?: string, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1) {
    return this.adminService.listSessions(status, page);
  }

  @Get('alerts') @ApiOperation({ summary: 'B-019 — Alertes bypass' })
  getAlerts(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1) {
    return this.adminService.getAlerts(page);
  }

  @Patch('users/:id/suspend') @ApiOperation({ summary: 'B-025 — Suspendre utilisateur' })
  suspendUser(@Param('id') id: string, @Body() dto: SuspendDto) {
    return this.adminService.suspendUser(id, dto.reason, dto.days);
  }

  @Delete('users/:id') @ApiOperation({ summary: 'B-025 — Bannir + anonymiser (RGPD)' })
  banUser(@Param('id') id: string, @Body() dto: BanDto) {
    return this.adminService.banUser(id, dto.reason);
  }

  @Get('finance') @ApiOperation({ summary: 'B-025 — Métriques financières' }) @ApiQuery({ name: 'period', description: 'YYYY-MM' })
  getFinance(@Query('period') period = new Date().toISOString().substring(0, 7)) {
    return this.adminService.getFinance(period);
  }
}
