import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';

import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { EResponseCode } from '../enums/response-code.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly _logger: Logger) {}

  private static handleResponse(
    response: Response,
    exception: HttpException | QueryFailedError | Error,
  ): void {
    let responseBody: any = {
      code: EResponseCode.InternalServerError,
      message: 'Internal server error',
      data: null,
    };
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      responseBody = exception.getResponse();
      statusCode = exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      responseBody = {
        code: EResponseCode.BadRequestError,
        message: exception.message,
        data: null,
      };
    } else if (exception instanceof Error) {
      responseBody.message = exception.stack;
    }

    response.status(statusCode).json(responseBody);
  }

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    // Handling error message and logging
    this.handleMessage(exception);

    // Response to client
    AllExceptionsFilter.handleResponse(response, exception);
  }

  private handleMessage(
    exception: HttpException | QueryFailedError | Error,
  ): void {
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      message = JSON.stringify(exception.getResponse());
    } else if (exception instanceof QueryFailedError) {
      message = exception.stack.toString();
    } else if (exception instanceof Error) {
      message = exception.stack.toString();
    }

    this._logger.error(message);
  }
}
