import { Body, Get, Post, Put, Query } from '@nestjs/common';

import { ApiKeyAuth } from '../../decorators/api-key-auth.decorator';
import { GetAuthUser } from '../../decorators/get-auth-user.decorator';
import { InitController } from '../../decorators/init-controller.decorator';
import { JwtAndRolesGuard } from '../../decorators/jwt-roles-guard.decorator';
import { UserType } from '../../shared/enums/user-type.enum';
import { UserDto } from '../users/dto/user.dto';
import { DaysOffService } from './days-off.service';
import { CreateDayOffRequestDto } from './dto/create-day-off-request.dto';
import { CreateDayOffDto } from './dto/create-day-off.dto';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { DaysOffFilterDto } from './dto/days-off-filter.dto';
import { EditHolidayDto } from './dto/edit-holiday.dto';
import { HandleDayOffRequestDto } from './dto/handle-day-off-request.dto';
import { HandleHolidayDto } from './dto/handle-holiday.dto';

@InitController('days-off')
@ApiKeyAuth()
export class DaysOffController {
  constructor(private readonly _daysOffService: DaysOffService) {}

  @Post('me/request-day-off')
  @JwtAndRolesGuard(UserType.USER)
  async requestDayOff(
    @GetAuthUser() authUser: UserDto,
    @Body() createDayOffRequestDto: CreateDayOffRequestDto,
  ) {
    return await this._daysOffService.requestDayOff(
      createDayOffRequestDto,
      authUser,
    );
  }

  @Post('me/withdraw-request-for-day-off')
  @JwtAndRolesGuard(UserType.USER)
  async withdrawRequestDayOff(
    @GetAuthUser() authUser: UserDto,
    @Body() handleDayOffRequestDto: HandleDayOffRequestDto,
  ) {
    return await this._daysOffService.withdrawRequestDayOff(
      authUser,
      handleDayOffRequestDto,
    );
  }

  @Get('me/day-off-requests')
  @JwtAndRolesGuard(UserType.USER)
  async getDayOffRequestsByLoggedUser(@GetAuthUser() authUser: UserDto) {
    return await this._daysOffService.getDayOffRequestsByUser(authUser);
  }

  @Get('me/days-off')
  @JwtAndRolesGuard(UserType.USER)
  async getUDaysOffByLoggedUser(
    @GetAuthUser() authUser: UserDto,
    @Query() daysOffFilterDto: DaysOffFilterDto,
  ) {
    return await this._daysOffService.getDaysOffByUser(
      authUser,
      daysOffFilterDto,
    );
  }

  @Get('/')
  @JwtAndRolesGuard(UserType.OWNER)
  async getDaysOff(@Query() daysOffFilterDto: DaysOffFilterDto) {
    return await this._daysOffService.getDaysOff(daysOffFilterDto);
  }

  @Get('day-off-requests')
  @JwtAndRolesGuard(UserType.OWNER)
  async getDayOffRequests() {
    return await this._daysOffService.getDayOffRequests();
  }

  @Post('approve-day-off-request')
  @JwtAndRolesGuard(UserType.OWNER)
  async approveDayOffRequest(
    @Body() approveDayOffRequest: HandleDayOffRequestDto,
  ) {
    return await this._daysOffService.approveDayOffRequest(
      approveDayOffRequest,
    );
  }

  @Post('decline-day-off-request')
  @JwtAndRolesGuard(UserType.OWNER)
  async declineDayOffRequest(
    @Body() declineDayOffRequestDto: HandleDayOffRequestDto,
  ) {
    return await this._daysOffService.declineDayOffRequest(
      declineDayOffRequestDto,
    );
  }

  @Post('create-day-off')
  @JwtAndRolesGuard(UserType.OWNER)
  async createDayOff(@Body() createDayOffDto: CreateDayOffDto) {
    return await this._daysOffService.requestDayOff(
      createDayOffDto,
      undefined,
      createDayOffDto.userId,
    );
  }

  @Post('delete-day-off')
  @JwtAndRolesGuard(UserType.OWNER)
  async deleteDayOff(@Body() deleteDayOffDto: HandleDayOffRequestDto) {
    return await this._daysOffService.deleteDayOff(deleteDayOffDto);
  }

  @Get('holidays')
  @JwtAndRolesGuard()
  async holidaysList() {
    return await this._daysOffService.holidaysList();
  }

  @Post('add-holiday')
  @JwtAndRolesGuard(UserType.OWNER)
  async addHoliday(@Body() createHolidayDto: CreateHolidayDto) {
    return await this._daysOffService.addHoliday(createHolidayDto);
  }

  @Put('edit-holiday')
  @JwtAndRolesGuard(UserType.OWNER)
  async editHoliday(@Body() createHolidayDto: EditHolidayDto) {
    return await this._daysOffService.editHoliday(createHolidayDto);
  }

  @Post('delete-holiday')
  @JwtAndRolesGuard(UserType.OWNER)
  async deleteHoliday(@Body() handleHolidayDto: HandleHolidayDto) {
    return await this._daysOffService.deleteHoliday(handleHolidayDto.holidayId);
  }
}
