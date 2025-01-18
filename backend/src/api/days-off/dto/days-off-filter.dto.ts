import { IsEnum, IsOptional } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { DayOffType } from '../../../shared/enums/day-off-type.enum';

export class DaysOffFilterDto {
  @ApiPropertyOptional({ enum: DayOffType })
  @IsOptional()
  @IsEnum(DayOffType)
  type?: DayOffType;

  @ApiPropertyOptional()
  @IsOptional()
  dateFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  dateTo?: Date;
}
