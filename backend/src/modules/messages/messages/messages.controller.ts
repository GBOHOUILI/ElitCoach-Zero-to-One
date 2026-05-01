import { Controller, Get, Post, Body, Param, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../../common/decorators/auth.guard';

class SendMessageDto {
  @ApiProperty() @IsString() content: string;
}

class CreateConvDto {
  @ApiProperty() @IsString() coachId: string;
  @ApiProperty() @IsString() clientId: string;
}

@ApiTags('Messages')
@Controller('conversations')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-017 — Mes conversations' })
  getConversations(@CurrentUser('userId') userId: string, @CurrentUser('role') role: string) {
    return this.messagesService.getMyConversations(userId, role);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-019 — Admin : Créer conversation' })
  createConversation(@Body() dto: CreateConvDto) {
    return this.messagesService.createConversation(dto.coachId, dto.clientId);
  }

  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-017 — Messages d\'une conversation' })
  getMessages(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return this.messagesService.getMessages(id, userId, role, page);
  }

  @Post(':id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-017 — Envoyer message (anti-bypass)' })
  sendMessage(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(id, userId, role, dto.content);
  }
}
