import { Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

import { GLOBAL_LOGGER } from '../shared/constants';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    GLOBAL_LOGGER.error({
      message: 'Error on server',
      path: request?.url,
      requestBody: request?.body,
      exceptionResponse: exception?.getResponse(),
    });

    response.status(500).json({
      statusCode: 500,
      message: 'Error on server',
    });
  }
}
