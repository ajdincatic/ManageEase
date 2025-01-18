import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../shared/abstract.dto';

export class HolidayDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  dates: string[];

  @ApiProperty()
  numberOfSelectedDays: number;

  @ApiProperty()
  isPassed: boolean;

  @ApiProperty()
  isCurrentlyActive: boolean;
}
