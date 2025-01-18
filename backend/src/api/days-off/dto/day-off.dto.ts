import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../shared/abstract.dto';
import { DayOffType } from '../../../shared/enums/day-off-type.enum';

export class DayOffDto extends AbstractDto {
  @ApiProperty()
  type: DayOffType;

  @ApiProperty()
  dates: string[];

  @ApiProperty()
  numberOfSelectedDays: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  isPassed: boolean;

  @ApiProperty()
  isCurrentlyActive: boolean;
}
