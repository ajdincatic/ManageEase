import { IsNotEmpty } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

export class EditUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}
