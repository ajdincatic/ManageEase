import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class HandleHolidayDto {
  @ApiProperty()
  @IsNotEmpty()
  holidayId: number;
}
