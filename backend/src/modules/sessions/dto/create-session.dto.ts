import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty() @IsString() coachId: string;
  @ApiProperty() @IsDateString() scheduledAt: string;
  @ApiPropertyOptional({ default: 60 }) @IsInt() @Min(30) @IsOptional() durationMins?: number;
}

export class CompleteSessionDto {
  @ApiPropertyOptional() @IsString() @IsOptional() coachNotes?: string;
}

export class CancelSessionDto {
  @ApiPropertyOptional() @IsString() @IsOptional() cancelReason?: string;
}

export class CreateReviewDto {
  @ApiProperty({ minimum: 1, maximum: 5 }) @IsInt() @Min(1) rating: number;
  @ApiPropertyOptional() @IsString() @IsOptional() comment?: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() listening?: number;
  @ApiPropertyOptional() @IsInt() @IsOptional() methodology?: number;
  @ApiPropertyOptional() @IsInt() @IsOptional() results?: number;
  @ApiPropertyOptional() @IsInt() @IsOptional() punctuality?: number;
}
