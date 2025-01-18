import { IsNotEmpty } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateIterationDto } from './create-iteration.dto';

export class EditIterationDto extends PartialType(CreateIterationDto) {
  @ApiProperty()
  @IsNotEmpty()
  iterationId: number;
}
