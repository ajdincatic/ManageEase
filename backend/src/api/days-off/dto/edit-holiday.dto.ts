import { IsNotEmpty } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateHolidayDto } from './create-holiday.dto';

export class EditHolidayDto extends PartialType(CreateHolidayDto) {
  @ApiProperty()
  @IsNotEmpty()
  holidayId: number;
}
