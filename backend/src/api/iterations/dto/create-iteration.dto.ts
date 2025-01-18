import { IsNotEmpty, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { DateFormatMatches } from '../../../decorators/date-format-matches.decorator';

export class CreateIterationDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @DateFormatMatches()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @DateFormatMatches()
  endDate: Date;
}
