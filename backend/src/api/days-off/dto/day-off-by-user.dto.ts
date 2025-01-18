import { ApiProperty } from '@nestjs/swagger';

import { DayOffType } from '../../../shared/enums/day-off-type.enum';

export class DayOffByUserDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  type: DayOffType;

  @ApiProperty()
  description: string;
}
