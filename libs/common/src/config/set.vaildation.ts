import {
  INestApplication,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';

export function setValidation(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const error = errors.map((e) => ({
          [e.property]: e.constraints,
        }));
        return new BadRequestException(error);
      },
    }),
  );
}
