import { NestFactory } from '@nestjs/core';
import { TransferModule } from './transfer.module';
// import { ValidationPipe } from '@nestjs/common';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { setSwagger } from '@app/common';

async function bootstrap() {
  // console.log('Transfer service is starting...');
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   TransferModule,
  //   {
  //     transport: Transport.NATS,
  //     options: {
  //       servers: ['nats://nats'],
  //     },
  //   },
  // );
  // app.useGlobalPipes(new ValidationPipe());
  // await app.listen();

  const app = await NestFactory.create<NestExpressApplication>(TransferModule);

  const conf = app.get(ConfigService);

  setSwagger(app);

  const serviceName = conf.get('SERVICE_NAME');
  const port = conf.get('PORT') ?? 4002;
  const baseUrl = conf.get('BASE_URL');

  app.enableCors();

  await app.listen(port, () =>
    console.log(`${serviceName} Server Listening on ${baseUrl} 🚀  `),
  );
}
bootstrap();
