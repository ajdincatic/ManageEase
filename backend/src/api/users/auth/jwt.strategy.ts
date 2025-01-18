import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UsersService } from '../users.service';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly _configService: ConfigService,
    public readonly _usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate({
    iat,
    exp,
    id,
    isRefresh,
  }: {
    iat: number;
    exp: number;
    id: number;
    isRefresh: boolean;
  }): Promise<UserDto> {
    const timeDiff = exp - iat;

    if (isRefresh) throw new UnauthorizedException();

    if (timeDiff <= 0) throw new UnauthorizedException();

    const user = await this._usersService.getUserById(id);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
