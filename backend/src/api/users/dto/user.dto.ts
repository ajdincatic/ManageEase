import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AbstractDto } from '../../../shared/abstract.dto';
import { UserType } from '../../../shared/enums/user-type.enum';
import { CalendarEventDto } from '../../days-off/dto/calendar-event.dto';
import { DayOffDto } from '../../days-off/dto/day-off.dto';
import { DaysOff } from '../../days-off/entities/days-off.entity';
import { IterationDto } from '../../iterations/dto/iteration.dto';

export class UserDto extends AbstractDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  type: UserType;

  @ApiProperty()
  email: string;

  @ApiProperty()
  dateOfEmployment: Date;

  @ApiProperty()
  calculateBasedOnDateOfEmployment: boolean;

  @ApiProperty()
  numberOfVacationDays: number;

  @ApiProperty()
  daysOff: DaysOff[];

  @ApiProperty()
  numberOfDayOffRequests: number;

  @ApiProperty()
  numberOfUsedVacationDays: number;

  @ApiProperty()
  numberOfUsedSickLeaveDays: number;

  @ApiProperty()
  numberOfUsedPaidLeaveDays: number;

  @ApiProperty()
  numberOfUsedPaidLeaveFromManageEaseDays: number;

  @ApiProperty()
  numberOfUsedUnpaidLeaveDays: number;

  @ApiProperty()
  upcomingDaysOff?: DayOffDto[];

  @ApiProperty()
  requests?: DayOffDto[];

  @ApiProperty()
  calendar?: CalendarEventDto[];

  @ApiProperty()
  activeIteration?: IterationDto;

  // ! Excluded fields

  @Exclude()
  password: string;
}
