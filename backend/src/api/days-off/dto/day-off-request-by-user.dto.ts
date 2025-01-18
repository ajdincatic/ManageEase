import { ApiProperty } from '@nestjs/swagger';

import { DayOffType } from '../../../shared/enums/day-off-type.enum';

export class DayOffRequestByUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  numberOfSelectedDays: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dates: string[];

  @ApiProperty()
  type: DayOffType;

  @ApiProperty()
  description: string;
}
