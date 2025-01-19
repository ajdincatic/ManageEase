import { Repository } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DayOffType } from '../../shared/enums/day-off-type.enum';
import { EmailTemplates } from '../../shared/enums/email-templates.enum';
import { UserType } from '../../shared/enums/user-type.enum';
import { MomentService } from '../../shared/helpers/moment.service';
import { UtilsService } from '../../shared/helpers/utils.service';
import { DaysOffService } from '../days-off/days-off.service';
import { EmailService } from '../email/email.service';
import { IterationsService } from '../iterations/iterations.service';
import { AuthService } from './auth/auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { LoggedUserDto } from './dto/logged-user.dto';
import { LoginDto } from './dto/login.dto';
import { Users } from './entities/users.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly _usersRepository: Repository<Users>,
    private readonly _authService: AuthService,
    private readonly _daysOffService: DaysOffService,
    private readonly _iterationsService: IterationsService,
    private readonly emailService: EmailService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const findUser = await this._usersRepository.findOneBy({
      type: UserType.OWNER,
    });
    if (findUser) return;

    await this._usersRepository.save({
      firstName: 'ManageEase',
      lastName: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      type: UserType.OWNER,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    const checkEmailExsists = await this._usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
      withDeleted: true,
    });

    if (checkEmailExsists)
      throw new BadRequestException('Email already exists.');

    if (
      !createUserDto.calculateBasedOnDateOfEmployment &&
      !createUserDto.numberOfVacationDays
    )
      throw new BadRequestException('Insert number of vacation days.');

    const numberOfVacationDays = createUserDto.calculateBasedOnDateOfEmployment
      ? MomentService.calculateVacationDays(createUserDto.dateOfEmployment)
      : createUserDto.numberOfVacationDays;

    const password = UtilsService.generateRandomString(12);
    await this._usersRepository.save({
      ...createUserDto,
      numberOfVacationDays,
      password,
    });

    this.emailService.sendEmail(
      createUserDto.email,
      EmailTemplates.USER_CREATED,
      {
        password,
      },
    );

    return true;
  }

  async details(userId: number): Promise<UserDto> {
    const findUser = await this.getUserById(userId);

    await this.assignDayOffUssageToUser(findUser);

    findUser.upcomingDaysOff = await this._daysOffService.getDaysOffByUser(
      findUser,
      {},
    );

    findUser.requests = await this._daysOffService.getDayOffRequestsByUser(
      findUser,
    );

    return findUser;
  }

  async edit(editUserDto: EditUserDto): Promise<boolean> {
    const findUser = await this.getUserById(editUserDto.userId);

    const checkEmailExsists = await this._usersRepository.findOne({
      where: {
        email: editUserDto.email,
      },
      withDeleted: true,
    });

    if (
      checkEmailExsists &&
      editUserDto.email &&
      findUser.email !== editUserDto.email
    )
      throw new BadRequestException('Email already exists.');

    if (
      !editUserDto.calculateBasedOnDateOfEmployment &&
      !editUserDto.numberOfVacationDays
    )
      throw new BadRequestException('Insert number of vacation days.');

    let numberOfVacationDays = findUser.numberOfUsedVacationDays;

    if (
      editUserDto.dateOfEmployment &&
      editUserDto.calculateBasedOnDateOfEmployment
    ) {
      numberOfVacationDays = MomentService.calculateVacationDays(
        editUserDto.dateOfEmployment || findUser.dateOfEmployment,
      );
    }

    if (
      editUserDto.numberOfVacationDays &&
      !editUserDto.calculateBasedOnDateOfEmployment
    ) {
      numberOfVacationDays = editUserDto.numberOfVacationDays;
    }

    await this._usersRepository.save({
      id: findUser.id,
      ...editUserDto,
      numberOfVacationDays,
    });

    return true;
  }

  async delete(userId: number): Promise<boolean> {
    const findUser = await this.getUserById(userId);

    await this._usersRepository.softDelete(findUser.id);

    return true;
  }

  async getUsers(): Promise<UserDto[]> {
    const usersList = (
      await this._usersRepository.find({
        where: {
          type: UserType.USER,
        },
        order: {
          firstName: {
            direction: 'ASC',
          },
          lastName: {
            direction: 'ASC',
          },
        },
      })
    ).toDtos();

    for await (const user of usersList)
      await this.assignDayOffUssageToUser(user);

    return usersList;
  }

  async getUserById(id: number): Promise<UserDto> {
    const user = await this._usersRepository
      .findOneByOrFail({
        id,
      })
      .catch(() => {
        throw new BadRequestException('User not found');
      });

    return user.toDto();
  }

  async login(loginDto: LoginDto): Promise<LoggedUserDto> {
    const userFind = await this._usersRepository
      .createQueryBuilder('u')
      .where('u.email = :email', { email: loginDto.email })
      .getOne();

    if (!userFind) throw new BadRequestException('Wrong username or password.');

    const isPasswordValid = await UtilsService.validateHash(
      loginDto.password,
      userFind && userFind.password,
    );

    if (!isPasswordValid)
      throw new BadRequestException('Wrong username or password.');

    const tokenPayload = await this._authService.createToken(userFind);

    return new LoggedUserDto({ user: userFind, token: tokenPayload });
  }

  async me(userDto: UserDto): Promise<UserDto> {
    if (userDto.type === UserType.USER) {
      await this.assignDayOffUssageToUser(userDto);

      userDto.upcomingDaysOff = await this._daysOffService.getDaysOffByUser(
        userDto,
        {
          dateFrom: MomentService.getFirstDateOfCurrentMonth(),
          dateTo: MomentService.getLastDateOfCurrentMonth(),
        },
      );
    } else {
      userDto.numberOfDayOffRequests = (
        await this._daysOffService.getDayOffRequests()
      ).length;

      userDto.calendar = await this._daysOffService.calendar();

      userDto.activeIteration =
        await this._iterationsService.getActiveIteration();
    }

    return userDto;
  }

  async assignDayOffUssageToUser(user: UserDto): Promise<void> {
    user.numberOfUsedVacationDays =
      await this._daysOffService.getNumberOfDayOffsByUserAndType(
        user,
        DayOffType.VACATION,
      );
    user.numberOfUsedSickLeaveDays =
      await this._daysOffService.getNumberOfDayOffsByUserAndType(
        user,
        DayOffType.SICK_LEAVE,
      );
    user.numberOfUsedPaidLeaveDays =
      await this._daysOffService.getNumberOfDayOffsByUserAndType(
        user,
        DayOffType.PAID_LEAVE,
      );
    user.numberOfUsedPaidLeaveFromManageEaseDays =
      await this._daysOffService.getNumberOfDayOffsByUserAndType(
        user,
        DayOffType.PAID_LEAVE_FROM_COMPANY,
      );
    user.numberOfUsedUnpaidLeaveDays =
      await this._daysOffService.getNumberOfDayOffsByUserAndType(
        user,
        DayOffType.UNPAID_LEAVE,
      );
    user.numberOfDayOffRequests =
      await this._daysOffService.getNumberOfDayOffRequestsByUser(user);
  }

  async changePassword(
    authUser: UserDto,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const userFind = await this._usersRepository
      .createQueryBuilder('u')
      .where('u.id = :id', { id: authUser.id })
      .addSelect('u.password')
      .getOneOrFail();

    const isPasswordValid = await UtilsService.validateHash(
      changePasswordDto.oldPassword,
      userFind && userFind.password,
    );

    if (!isPasswordValid) throw new BadRequestException('Wrong old password.');

    if (
      changePasswordDto.newPassword != changePasswordDto.newPasswordConfirmation
    )
      throw new BadRequestException(
        'Password and password confirmation mismatch.',
      );

    await this._usersRepository.save({
      id: authUser.id,
      password: changePasswordDto.newPassword,
    });

    return true;
  }
}
