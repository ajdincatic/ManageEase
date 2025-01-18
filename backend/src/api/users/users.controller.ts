import { Body, Get, Post, Put, Query } from '@nestjs/common';

import { ApiKeyAuth } from '../../decorators/api-key-auth.decorator';
import { GetAuthUser } from '../../decorators/get-auth-user.decorator';
import { InitController } from '../../decorators/init-controller.decorator';
import { JwtAndRolesGuard } from '../../decorators/jwt-roles-guard.decorator';
import { UserType } from '../../shared/enums/user-type.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { HandleUserDto } from './dto/handle-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@InitController('users')
@ApiKeyAuth()
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this._usersService.login(loginDto);
  }

  @Post('change-password')
  @JwtAndRolesGuard(UserType.OWNER, UserType.USER)
  async changePassword(
    @GetAuthUser() authUser: UserDto,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this._usersService.changePassword(authUser, changePasswordDto);
  }

  @Get('me')
  @JwtAndRolesGuard()
  async getAuthUser(@GetAuthUser() authUser: UserDto) {
    return await this._usersService.me(authUser);
  }

  @Post('create')
  @JwtAndRolesGuard(UserType.OWNER)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this._usersService.create(createUserDto);
  }

  @Get('list')
  @JwtAndRolesGuard(UserType.OWNER)
  async getUsers() {
    return await this._usersService.getUsers();
  }

  @Get('details')
  @JwtAndRolesGuard(UserType.OWNER)
  async getUserDetails(@Query('userId') userId: number) {
    return await this._usersService.details(userId);
  }

  @Put('edit')
  @JwtAndRolesGuard(UserType.OWNER)
  async edit(@Body() editUserDto: EditUserDto) {
    return await this._usersService.edit(editUserDto);
  }

  @Post('delete')
  @JwtAndRolesGuard(UserType.OWNER)
  async deleteUser(@Body() handleUserDto: HandleUserDto) {
    return await this._usersService.delete(handleUserDto.userId);
  }
}
