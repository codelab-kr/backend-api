import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { BaseExceptionFilter } from '@nestjs/core';
import { IExceptionResponse } from '../exception.interface';
import { Message } from '@app/common';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  private res: IExceptionResponse;

  private ExceptionFilter(exception: RpcException | AxiosError) {
    const error =
      exception instanceof RpcException
        ? (exception.getError() as IExceptionResponse)
        : (exception.response?.data as IExceptionResponse);
    this.res = {
      ...error,
      statusCode: error['status'],
      timestamp: new Date().toISOString(),
      data: error['response'],
    };
  }

  private httpExceptionFilter(exception: HttpException): void {
    this.res = exception.getResponse() as IExceptionResponse;
  }

  catch(exception: any, host: ArgumentsHost) {
    super.catch(exception, host);
    if (exception instanceof RpcException || exception instanceof AxiosError) {
      this.ExceptionFilter(exception);
    } else if (exception instanceof HttpException) {
      this.httpExceptionFilter(exception);
    } else {
      return new HttpException(
        Message.UNKNOWN_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    this.logger.error(this.res);
  }
}
