import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessException } from '../../application/exceptions/business.exception';
import { ResourceNotFoundException } from '../../application/exceptions/resource-not-found.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let error = 'Internal Server Error';

    if (exception instanceof BusinessException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      error = 'Business Error';
    } else if (exception instanceof ResourceNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
      error = 'Resource Not Found';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      message = exceptionResponse.message || exception.message;
      error = exceptionResponse.error || 'Http Exception';
    }

    response.status(status).json({
      timestamp: new Date().toISOString(),
      status,
      error,
      message,
      path: request.url,
    });
  }
}