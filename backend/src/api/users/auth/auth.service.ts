import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { MomentService } from '../../../shared/helpers/moment.service';
import { Users } from '../entities/users.entity';
import { TokenPayloadDto } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) {}

  async createToken(user: Users): Promise<TokenPayloadDto> {
    const expiresIn = +this._configService.get('JWT_EXPIRATION_TIME');

    const accessToken = await this._jwtService.signAsync(
      { id: user.id, email: user.email, isRefresh: false },
      {
        expiresIn,
      },
    );

    return new TokenPayloadDto({
      expiresIn: MomentService.generateTokenExpirationDate(),
      accessToken,
    });
  }
}
