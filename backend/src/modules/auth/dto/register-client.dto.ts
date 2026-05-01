import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail, IsString, MinLength, IsInt, Min, IsBoolean, IsOptional, Matches,
} from 'class-validator';

export class RegisterClientDto {
  @ApiProperty({ example: 'marie@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password1' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 'Password doit contenir 1 majuscule et 1 chiffre' })
  password: string;

  @ApiProperty({ example: 'Marie' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Martin' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Signer 3 nouveaux clients et atteindre 5000€ de CA mensuel en 3 mois.', minLength: 50 })
  @IsString()
  @MinLength(50)
  objective: string;

  @ApiProperty({ example: 300, description: 'Budget mensuel EUR' })
  @IsInt()
  @Min(0)
  budget: number;

  @ApiProperty({ example: 3, description: 'Heures par semaine disponibles' })
  @IsInt()
  @Min(0)
  hoursPerWeek: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  hadCoachBefore: boolean;

  @ApiPropertyOptional({ example: 'Augmenté mon CA de 30%, arrêté car déménagement.' })
  @IsString()
  @IsOptional()
  previousCoachResult?: string;

  @ApiProperty({ example: 'Mon entreprise stagne depuis 6 mois et j\'ai un salon pro en mars.', minLength: 50 })
  @IsString()
  @MinLength(50)
  whyNow: string;
}
