import {
  HttpException,
  HttpStatus,
  INestApplication,
  INestMicroservice,
  ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Message } from '../message/message';

export function setValidation(app: INestApplication | INestMicroservice): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (error) => `${Object.values(error.constraints).join(', ')}`,
        );
        console.log(messages);
        const error = new HttpException(
          Message.BAD_PARAMETERS,
          HttpStatus.BAD_REQUEST,
        );
        throw new RpcException(error);
      },
    }),
  );
}
