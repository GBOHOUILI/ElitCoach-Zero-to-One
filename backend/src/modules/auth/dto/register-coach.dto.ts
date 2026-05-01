import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail, IsString, MinLength, IsArray, IsInt, Min, IsUrl, IsOptional,
  Matches,
} from 'class-validator';

export class RegisterCoachDto {
  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password1', description: 'Min 8 chars, 1 majuscule, 1 chiffre' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 'Password doit contenir 1 majuscule et 1 chiffre' })
  password: string;

  @ApiProperty({ example: 'Jean' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: ['Business', 'Leadership'] })
  @IsArray()
  specialties: string[];

  @ApiProperty({ example: ['ICF ACC', 'RNCP'] })
  @IsArray()
  certifications: string[];

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  yearsExperience: number;

  @ApiProperty({ example: 150, description: 'Tarif horaire en EUR, min 50' })
  @IsInt()
  @Min(50)
  hourlyRate: number;

  @ApiProperty({ example: 'Coach certifié ICF avec 5 ans expérience en business coaching...', minLength: 200 })
  @IsString()
  @MinLength(200)
  bio: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=xxx' })
  @IsUrl()
  @IsOptional()
  videoUrl?: string;
}
