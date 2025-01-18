import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserDto } from '../api/users/dto/user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this._reflector.get<string[]>('roles', context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user: UserDto = request.user;

    return roles.includes(user.type);
  }
}
