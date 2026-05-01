import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AvailabilitySlotDto {
  @ApiProperty({ minimum: 0, maximum: 6, description: '0=Dimanche, 1=Lundi...' })
  @IsInt() @Min(0) @Max(6) dayOfWeek: number;

  @ApiProperty({ example: '09:00' }) @IsString() startTime: string;
  @ApiProperty({ example: '17:00' }) @IsString() endTime: string;
}

export class SetAvailabilityDto {
  @ApiProperty({ type: [AvailabilitySlotDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => AvailabilitySlotDto)
  slots: AvailabilitySlotDto[];
}
