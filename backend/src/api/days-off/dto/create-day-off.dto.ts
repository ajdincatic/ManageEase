import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { CreateDayOffRequestDto } from './create-day-off-request.dto';

export class CreateDayOffDto extends CreateDayOffRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}
