import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DateFormatMatches } from '../../../decorators/date-format-matches.decorator';
import { DayOffType } from '../../../shared/enums/day-off-type.enum';

export class CreateDayOffRequestDto {
  @ApiProperty()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @DateFormatMatches(true)
  dates: string[];

  @ApiProperty({ enum: DayOffType })
  @IsNotEmpty()
  @IsEnum(DayOffType)
  type: DayOffType;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(50)
  description: string;
}
