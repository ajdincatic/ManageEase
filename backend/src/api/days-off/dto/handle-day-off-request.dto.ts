import { IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class HandleDayOffRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  requestId: number;
}
