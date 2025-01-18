import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DaysOffModule } from '../days-off/days-off.module';
import { IterationsModule } from '../iterations/iterations.module';
import { ApiKeyStrategy } from './auth/auth-header-api-key.strategy';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { Users } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => DaysOffModule),
    forwardRef(() => IterationsModule),
    TypeOrmModule.forFeature([Users]),
    // register jwt auth
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => ({
        secret: _configService.get('JWT_SECRET_KEY'),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy, ApiKeyStrategy],
})
export class UsersModule {}
