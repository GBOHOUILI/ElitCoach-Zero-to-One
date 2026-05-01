import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsArray, IsOptional, IsInt, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GoalStepDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() dueDate?: string;
  @ApiProperty() @IsInt() order: number;
}

export class CreateGoalDto {
  @ApiProperty() @IsString() clientId: string;
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiProperty() @IsDateString() targetDate: string;
  @ApiProperty({ type: [GoalStepDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => GoalStepDto) steps: GoalStepDto[];
}

export class UpdateStepDto {
  @ApiProperty() @IsBoolean() isCompleted: boolean;
}

export class UpdateProgressDto {
  @ApiProperty({ minimum: 0, maximum: 100 }) @IsInt() progress: number;
}

export class CreateCheckInDto {
  @ApiProperty({ description: '5 answers object' }) answers: Record<string, string>;
}

export class UpdateCheckInDto {
  @ApiProperty() @IsString() coachNote: string;
}
