import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DaysOffModule } from './api/days-off/days-off.module';
import { EmailModule } from './api/email/email.module';
import { IterationsModule } from './api/iterations/iterations.module';
import { UsersModule } from './api/users/users.module';
import { ApiKeyMiddleware } from './middlewares/api-key.middleware';
import { PasswordSubscriber } from './shared/entity-subscribers/password-subscriber';
import { Env } from './shared/enums/env.enum';

@Module({
  imports: [
    // env variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // database config
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: _configService.get('DB_HOST'),
        port: _configService.get('DB_PORT'),
        username: _configService.get('DB_USERNAME'),
        password: _configService.get('DB_PASSWORD'),
        database: _configService.get('DB_DATABASE'),
        migrationsRun: false,
        synchronize: true,
        logging: _configService.get('NODE_ENV') === Env.DEV,
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
        subscribers: [PasswordSubscriber],
      }),
    }),
    // modules
    UsersModule,
    IterationsModule,
    DaysOffModule,
    EmailModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(ApiKeyMiddleware).forRoutes('*');
  }
}
