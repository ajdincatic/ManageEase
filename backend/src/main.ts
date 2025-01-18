import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { InternalServerErrorExceptionFilter } from './filters/internal-server-error.filter';
import { QueryFailedExceptionFilter } from './filters/typeorm-error.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { GLOBAL_LOGGER } from './shared/constants';
import { Env } from './shared/enums/env.enum';
import { extendArrayPrototype } from './shared/global';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);

  extendArrayPrototype();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new InternalServerErrorExceptionFilter(),
    new QueryFailedExceptionFilter(),
  );

  if (configService.get<string>('NODE_ENV') === Env.DEV) {
    app.useGlobalInterceptors(new LoggingInterceptor());

    setupSwagger(app);
  }

  const port = configService.get('PORT');
  await app.listen(port);
  GLOBAL_LOGGER.log(`Server running on port ${port}`);
}

bootstrap();
