import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DateFormatMatches } from '../../../decorators/date-format-matches.decorator';

export class CreateHolidayDto {
  @ApiProperty()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @DateFormatMatches(true)
  dates: string[];

  @ApiPropertyOptional()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}
