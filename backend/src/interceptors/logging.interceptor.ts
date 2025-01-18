import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { GLOBAL_LOGGER } from '../shared/constants';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const url = context.switchToHttp().getRequest().url;

    GLOBAL_LOGGER.debug(`Start of execution[${url}]...`);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          GLOBAL_LOGGER.debug(
            `...End of execution[${url}] - ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
