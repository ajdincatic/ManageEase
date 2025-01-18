import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class HandleUserDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}
