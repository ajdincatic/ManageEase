import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../shared/abstract.dto';

export class IterationDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  isActive: boolean;
}
