import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ChangeCoachStatusDto {
  @ApiProperty({ enum: ['PENDING','SCREENING','INTERVIEW','TEST','APPROVED','REJECTED'] })
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;
}

export class ChangeClientStatusDto {
  @ApiProperty({ enum: ['PENDING','APPROVED','REJECTED'] })
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;
}
