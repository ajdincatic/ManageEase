import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class HandleIterationDto {
  @ApiProperty()
  @IsNotEmpty()
  iterationId: number;
}
