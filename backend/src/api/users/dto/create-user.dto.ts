import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DateFormatMatches } from '../../../decorators/date-format-matches.decorator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @DateFormatMatches()
  dateOfEmployment: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  calculateBasedOnDateOfEmployment: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  numberOfVacationDays: number;
}
