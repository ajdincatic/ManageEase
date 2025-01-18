import { ApiProperty } from '@nestjs/swagger';

export class CalendarEventDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  start: string;

  @ApiProperty()
  allDay: boolean;

  @ApiProperty()
  color?: string;
}
