import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsUrl, IsOptional, MinLength, Min } from 'class-validator';

export class UpdateCoachDto {
  @ApiPropertyOptional() @IsString() @MinLength(200) @IsOptional() bio?: string;
  @ApiPropertyOptional() @IsInt() @Min(50) @IsOptional() hourlyRate?: number;
  @ApiPropertyOptional() @IsArray() @IsOptional() specialties?: string[];
  @ApiPropertyOptional() @IsArray() @IsOptional() certifications?: string[];
  @ApiPropertyOptional() @IsInt() @Min(1) @IsOptional() yearsExperience?: number;
  @ApiPropertyOptional() @IsUrl() @IsOptional() videoUrl?: string;
}
