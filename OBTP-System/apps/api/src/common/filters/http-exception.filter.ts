import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiErrorResponse } from '@obtp/shared-types';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal Server Error' };

    let message: string | string[] = 'Internal server error';
    let errorCode = 'ERR_INTERNAL';

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const respObj = exceptionResponse as any;
      message = respObj.message || message;
      errorCode = respObj.error || `ERR_${HttpStatus[status]}`;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    // Logging lỗi nghiêm trọng
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Critical Error at ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else {
      this.logger.warn(
        `Client Error at ${request.url} | Status: ${status} | Msg: ${JSON.stringify(message)}`,
      );
    }

    // Chuẩn hóa Output theo Interface Shared Types
    const errorResponse: ApiErrorResponse = {
      statusCode: status,
      errorCode: errorCode.toUpperCase().replace(/\s+/g, '_'),
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
