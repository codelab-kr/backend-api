import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('NestJS API Docs')
    .setDescription('NestJS API description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
