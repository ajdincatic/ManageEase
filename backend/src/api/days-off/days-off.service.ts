import * as _ from 'lodash';
import { Repository } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DayOffType } from '../../shared/enums/day-off-type.enum';
import { MomentService } from '../../shared/helpers/moment.service';
import { UtilsService } from '../../shared/helpers/utils.service';
import { IterationsService } from '../iterations/iterations.service';
import { Users } from '../users/entities/users.entity';
import { CalendarEventDto } from './dto/calendar-event.dto';
import { CreateDayOffRequestDto } from './dto/create-day-off-request.dto';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { DayOffByUserDto } from './dto/day-off-by-user.dto';
import { DayOffRequestByUserDto } from './dto/day-off-request-by-user.dto';
import { DaysOffFilterDto } from './dto/days-off-filter.dto';
import { EditHolidayDto } from './dto/edit-holiday.dto';
import { HandleDayOffRequestDto } from './dto/handle-day-off-request.dto';
import { DaysOff } from './entities/days-off.entity';
import { Holidays } from './entities/holidays.entity';
import { UserDto } from '../users/dto/user.dto';
import { HolidayDto } from './dto/holiday.dto';
import { DayOffDto } from './dto/day-off.dto';

@Injectable()
export class DaysOffService {
  constructor(
    @InjectRepository(DaysOff)
    private readonly _daysOffRepository: Repository<DaysOff>,
    @InjectRepository(Users)
    private readonly _usersRepository: Repository<Users>,
    @InjectRepository(Holidays)
    private readonly _holidaysRepository: Repository<Holidays>,
    private readonly _iterationsService: IterationsService,
  ) {}

  async requestDayOff(
    createDayOffRequestDto: CreateDayOffRequestDto,
    authUser: UserDto | undefined,
    userId: number | undefined = undefined,
  ): Promise<boolean> {
    let user = authUser;
    let isCreatedByOwner = false;

    if (userId) {
      user = (
        await this._usersRepository.findOneByOrFail({
          id: userId,
        })
      ).toDto();

      isCreatedByOwner = true;
    }

    if (!user) throw new BadRequestException('User not found.');

    const MAX_PAID_LEAVE_DAYS = 7;

    const numberOfSelectedDays = createDayOffRequestDto.dates.length;

    createDayOffRequestDto.dates = _.orderBy(
      createDayOffRequestDto.dates,
      (x) => new Date(x),
    );

    if (
      createDayOffRequestDto.type !== DayOffType.VACATION &&
      numberOfSelectedDays > 1
    )
      throw new BadRequestException(
        `You can choose only one date for this type(${createDayOffRequestDto.type}) of day off.`,
      );

    if (createDayOffRequestDto.type === DayOffType.VACATION) {
      if (
        !userId &&
        MomentService.checkIfDateIsBeforeOtherDate(
          createDayOffRequestDto.dates[0],
          1,
        )
      )
        throw new BadRequestException(
          `Selected date ${createDayOffRequestDto.dates[0]} is not valid date.`,
        );

      const numberOfRemainingDays =
        user.numberOfVacationDays -
        (await this.getNumberOfDayOffsAndDaysOffRequestsByUserAndType(
          user,
          DayOffType.VACATION,
        ));

      if (numberOfSelectedDays > numberOfRemainingDays)
        throw new BadRequestException('Not enough days for vacation.');
    }

    if (createDayOffRequestDto.type === DayOffType.PAID_LEAVE) {
      const numberOfRemainingDays =
        MAX_PAID_LEAVE_DAYS -
        (await this.getNumberOfDayOffsAndDaysOffRequestsByUserAndType(
          user,
          DayOffType.PAID_LEAVE,
        ));

      if (numberOfSelectedDays > numberOfRemainingDays)
        throw new BadRequestException('Not enough days for paid leave.');
    }

    if (createDayOffRequestDto.type !== DayOffType.VACATION) {
      if (
        !userId &&
        MomentService.checkIfDateIsBeforeOtherDate(
          createDayOffRequestDto.dates[0],
          -7,
        )
      )
        throw new BadRequestException(
          `Selected date ${createDayOffRequestDto.dates[0]} is not valid date.`,
        );
    }

    const activeIteration = await this._iterationsService.getActiveIteration();

    if (
      !MomentService.checkIfDateIsInScope(
        createDayOffRequestDto.dates[0],
        activeIteration.startDate,
        activeIteration.endDate,
      ) ||
      !MomentService.checkIfDateIsInScope(
        createDayOffRequestDto.dates[numberOfSelectedDays - 1],
        activeIteration.startDate,
        activeIteration.endDate,
      )
    )
      throw new BadRequestException(
        `Selected date is not in iteration date scope.`,
      );

    const daysOff = await this._daysOffRepository.findBy({
      user: {
        id: user.id,
      },
      iteration: {
        isActive: true,
      },
    });

    for (const dayOff of daysOff) {
      const checkIntersection = _.intersection(
        dayOff.dates,
        createDayOffRequestDto.dates,
      );

      if (checkIntersection.length > 0)
        throw new BadRequestException(
          `Already announced day off for dates ${checkIntersection}`,
        );
    }

    await this._daysOffRepository.save({
      ...createDayOffRequestDto,
      iteration: activeIteration,
      user: user,
      numberOfSelectedDays,
      isApproved: isCreatedByOwner,
    });

    if (!isCreatedByOwner) {
      //SEND EMAIL
    }

    return true;
  }

  async withdrawRequestDayOff(
    authUser: UserDto,
    handleDayOffRequestDto: HandleDayOffRequestDto,
  ): Promise<boolean> {
    const findRequest = await this._daysOffRepository
      .findOneOrFail({
        where: {
          id: handleDayOffRequestDto.requestId,
          user: { id: authUser.id },
        },
        relations: ['user'],
      })
      .catch(() => {
        throw new BadRequestException('Wrong request id');
      });

    if (findRequest.isApproved)
      throw new BadRequestException('Already approved');

    await this._daysOffRepository.delete(findRequest.id);

    return true;
  }

  async calendar(): Promise<CalendarEventDto[]> {
    const daysOffQuery = this._daysOffRepository
      .createQueryBuilder('daysOff')
      .select(
        `user.firstName || ' ' || user.lastName as "name", string_to_array(daysOff.dates,',') as "dates", daysOff.type`,
      )
      .innerJoin('daysOff.user', 'user')
      .innerJoin('daysOff.iteration', 'iteration')
      .andWhere('daysOff.isApproved IS TRUE')
      .andWhere('iteration.isActive IS TRUE')
      .orderBy('daysOff.dates', 'ASC');

    const holidaysQuery = this._holidaysRepository
      .createQueryBuilder('holiday')
      .select(
        `holiday.name, string_to_array(holiday.dates,',') as "dates", 'HOLIDAY' as "type"`,
      )
      .innerJoin('holiday.iteration', 'iteration')
      .andWhere('iteration.isActive IS TRUE')
      .orderBy('holiday.dates', 'ASC');

    const daysOff = [
      ...(await daysOffQuery.getRawMany()),
      ...(await holidaysQuery.getRawMany()),
    ];

    let result: CalendarEventDto[] = [];
    for (const dayOff of daysOff) {
      const dates = dayOff.dates;
      delete dayOff.dates;

      for (const date of dates) {
        result.push({
          title: dayOff.name,
          type: dayOff.type,
          start: date,
          allDay: true,
          color: UtilsService.getColorForCalendar(dayOff.type),
        });
      }
    }

    const validRange = {
      start: MomentService.getFirstDateOfPreviousMonth(),
      end: MomentService.getLastDateOfNextMonth(),
    };

    result = _.filter(result, (el) =>
      MomentService.checkIfDateIsInScope(
        el.start,
        validRange.start,
        validRange.end,
      ),
    );

    return _.orderBy(result, (el) => new Date(el.start));
  }

  async getDaysOff(
    daysOffFilterDto: DaysOffFilterDto,
  ): Promise<DayOffByUserDto[]> {
    const daysOffQuery = this._daysOffRepository
      .createQueryBuilder('daysOff')
      .select(
        `user.id as "userId", user.firstName || ' ' || user.lastName as "name", string_to_array(daysOff.dates,',') as "dates", daysOff.type, daysOff.description`,
      )
      .innerJoin('daysOff.user', 'user')
      .innerJoin('daysOff.iteration', 'iteration')
      .andWhere('daysOff.isApproved IS TRUE')
      .andWhere('iteration.isActive IS TRUE')
      .orderBy('daysOff.dates', 'ASC');

    if (daysOffFilterDto?.type) {
      daysOffQuery.andWhere('daysOff.type = :type', {
        type: daysOffFilterDto?.type,
      });
    }

    const daysOff = await daysOffQuery.getRawMany();

    let result: DayOffByUserDto[] = [];
    for (const dayOff of daysOff) {
      const dates = dayOff.dates;
      delete dayOff.dates;

      for (const date of dates) {
        result.push({ ...dayOff, date });
      }
    }

    if (daysOffFilterDto.dateFrom && daysOffFilterDto.dateTo) {
      result = _.filter(result, (el) =>
        MomentService.checkIfDateIsInScope(
          el.date,
          daysOffFilterDto.dateFrom ?? '',
          daysOffFilterDto.dateTo ?? '',
        ),
      );
    }

    return result;
  }

  async getDaysOffByUser(
    user: UserDto,
    daysOffFilterDto: DaysOffFilterDto,
  ): Promise<DayOffDto[]> {
    const findDaysOffQuery = this._daysOffRepository
      .createQueryBuilder('daysOff')
      .innerJoinAndSelect('daysOff.user', 'user')
      .innerJoinAndSelect('daysOff.iteration', 'iteration')
      .andWhere('user.id = :userId', { userId: user.id })
      .andWhere('daysOff.isApproved IS TRUE')
      .andWhere('iteration.isActive IS TRUE')
      .orderBy('daysOff.dates', 'ASC');

    if (daysOffFilterDto?.type) {
      findDaysOffQuery.andWhere('daysOff.type = :type', {
        type: daysOffFilterDto?.type,
      });
    }

    if (daysOffFilterDto?.dateFrom) {
      findDaysOffQuery.andWhere('daysOff.dates >= :dateFrom', {
        dateFrom: daysOffFilterDto?.dateFrom,
      });
    }

    if (daysOffFilterDto?.dateTo) {
      findDaysOffQuery.andWhere('daysOff.dates <= :dateTo', {
        dateTo: daysOffFilterDto?.dateTo,
      });
    }

    const findDaysOff = (await findDaysOffQuery.getMany()).toDtos();

    for await (const dayOff of findDaysOff) {
      dayOff.isPassed = MomentService.checkIfDateIsBeforeCurrentDate(
        dayOff.dates[dayOff.numberOfSelectedDays - 1],
      );
      dayOff.isCurrentlyActive = MomentService.checkIfCurrentDateIsInScope(
        dayOff.dates[0],
        dayOff.dates[dayOff.numberOfSelectedDays - 1],
      );
    }

    return findDaysOff;
  }

  async getDayOffRequests(): Promise<DayOffRequestByUserDto[]> {
    const findRequest = await this._daysOffRepository
      .createQueryBuilder('daysOff')
      .select(
        `daysOff.id, user.id as "userId", user.firstName || ' ' || user.lastName as "name", string_to_array(daysOff.dates,',') as "dates", 
        daysOff.type, daysOff.createdAt, daysOff.numberOfSelectedDays, daysOff.description`,
      )
      .innerJoin('daysOff.user', 'user')
      .innerJoin('daysOff.iteration', 'iteration')
      .andWhere('daysOff.isApproved IS NOT TRUE')
      .andWhere('iteration.isActive IS TRUE')
      .orderBy('daysOff.createdAt', 'DESC')
      .getRawMany();

    return findRequest;
  }

  async getDayOffRequestsByUser(user: UserDto): Promise<DayOffDto[]> {
    const findRequest = await this._daysOffRepository
      .createQueryBuilder('daysOff')
      .innerJoinAndSelect('daysOff.user', 'user')
      .innerJoinAndSelect('daysOff.iteration', 'iteration')
      .andWhere('user.id = :userId', { userId: user.id })
      .andWhere('daysOff.isApproved IS NOT TRUE')
      .andWhere('iteration.isActive IS TRUE')
      .orderBy('daysOff.createdAt', 'DESC')
      .getMany();

    return findRequest.toDtos();
  }

  async approveDayOffRequest(
    approveDayOffRequest: HandleDayOffRequestDto,
  ): Promise<boolean> {
    const findRequest = await this._daysOffRepository
      .findOneByOrFail({
        id: approveDayOffRequest.requestId,
      })
      .catch(() => {
        throw new BadRequestException('Wrong request id');
      });

    if (findRequest.isApproved)
      throw new BadRequestException('Already approved');

    await this._daysOffRepository.save({
      id: findRequest.id,
      isApproved: true,
    });

    //SEND EMAIL

    return true;
  }

  async declineDayOffRequest(
    declineDayOffRequestDto: HandleDayOffRequestDto,
  ): Promise<boolean> {
    const findRequest = await this._daysOffRepository
      .findOneOrFail({
        where: { id: declineDayOffRequestDto.requestId },
        relations: ['user'],
      })
      .catch(() => {
        throw new BadRequestException('Wrong request id');
      });

    if (findRequest.isApproved)
      throw new BadRequestException('Already approved');

    await this._daysOffRepository.delete(findRequest.id);

    //SEND EMAIL

    return true;
  }

  async deleteDayOff(
    deleteDayOffDto: HandleDayOffRequestDto,
  ): Promise<boolean> {
    const findRequest = await this._daysOffRepository
      .findOneOrFail({
        where: { id: deleteDayOffDto.requestId },
        relations: ['user'],
      })
      .catch(() => {
        throw new BadRequestException('Wrong request id');
      });

    await this._daysOffRepository.delete(findRequest.id);

    return true;
  }

  async getNumberOfDayOffsByUserAndType(
    user: UserDto,
    dayOffType: DayOffType,
    isApproved = true,
  ): Promise<number> {
    const findDaysOff = await this._daysOffRepository.findBy({
      type: dayOffType,
      user: {
        id: user.id,
      },
      isApproved,
      iteration: {
        isActive: true,
      },
    });

    let numberOfDays = 0;
    for (const dayOff of findDaysOff) {
      numberOfDays += dayOff.numberOfSelectedDays;
    }

    return numberOfDays;
  }

  async getNumberOfDayOffRequestsByUser(user: UserDto): Promise<number> {
    const findRequest = await this._daysOffRepository.findBy({
      user: {
        id: user.id,
      },
      isApproved: false,
      iteration: {
        isActive: true,
      },
    });

    return findRequest.length;
  }

  async getNumberOfDayOffsAndDaysOffRequestsByUserAndType(
    user: UserDto,
    dayOffType: DayOffType,
  ): Promise<number> {
    const findDaysOff = await this._daysOffRepository.findBy({
      type: dayOffType,
      user: {
        id: user.id,
      },
      iteration: {
        isActive: true,
      },
    });

    let numberOfDays = 0;
    for await (const dayOff of findDaysOff) {
      numberOfDays += dayOff.numberOfSelectedDays;
    }

    return numberOfDays;
  }

  //#region holidays endpoints

  async holidaysList(): Promise<HolidayDto[]> {
    const findHolidays = (
      await this._holidaysRepository.find({
        where: { iteration: { isActive: true } },
        order: {
          dates: {
            direction: 'ASC',
          },
        },
      })
    ).toDtos();

    for await (const holiday of findHolidays) {
      holiday.isPassed = MomentService.checkIfDateIsBeforeCurrentDate(
        holiday.dates[holiday.numberOfSelectedDays - 1],
      );
      holiday.isCurrentlyActive = MomentService.checkIfCurrentDateIsInScope(
        holiday.dates[0],
        holiday.dates[holiday.numberOfSelectedDays - 1],
      );
    }

    return findHolidays;
  }

  async holidayById(holidayId: number): Promise<HolidayDto> {
    const findHoliday = await this._holidaysRepository.findOneByOrFail({
      id: holidayId,
    });

    return findHoliday.toDto();
  }

  async addHoliday(createHolidayDto: CreateHolidayDto): Promise<boolean> {
    const findIteration = await this._iterationsService.getActiveIteration();

    const numberOfSelectedDays = createHolidayDto.dates.length;
    createHolidayDto.dates = _.orderBy(
      createHolidayDto.dates,
      (x) => new Date(x),
    );

    await this._holidaysRepository.save({
      ...createHolidayDto,
      iteration: findIteration,
      numberOfSelectedDays,
    });
    return true;
  }

  async editHoliday(createHolidayDto: EditHolidayDto): Promise<boolean> {
    const findHoliday = await this._holidaysRepository
      .findOneOrFail({
        where: { id: createHolidayDto.holidayId },
      })
      .catch(() => {
        throw new BadRequestException('Wrong holiday id');
      });

    const numberOfSelectedDays = createHolidayDto?.dates
      ? createHolidayDto.dates.length
      : findHoliday.dates.length;

    await this._holidaysRepository.save({
      id: findHoliday.id,
      ...createHolidayDto,
      numberOfSelectedDays,
    });

    return true;
  }

  async deleteHoliday(holidayId: number): Promise<boolean> {
    const findHoliday = await this._holidaysRepository
      .findOneOrFail({
        where: { id: holidayId },
      })
      .catch(() => {
        throw new BadRequestException('Wrong holiday id');
      });

    await this._holidaysRepository.delete(findHoliday.id);

    return true;
  }

  //#endregion
}
