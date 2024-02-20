import { NestFactory } from '@nestjs/core';
import { TransferModule } from './transfer.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { setSwagger } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TransferModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats'],
      },
    },
  );
  const service = app.get(ConfigService).get('SERVICE').toUpperCase();
  app.useGlobalPipes(new ValidationPipe());
  console.log(`${service} Server Started 🚀  `);
  await app.listen();

  // const app = await NestFactory.create<NestExpressApplication>(UserModule);
  // const conf = app.get(ConfigService);
  // setSwagger(app);
  // const service = conf.get('SERVICE');
  // const port = conf.get('PORT') ?? 4002;
  // const baseUrl = conf.get('BASE_URL');
  // app.enableCors();
  // await app.listen(port, () =>
  //   console.log(`${service} Server Listening on ${baseUrl} 🚀  `),
  // );
}
bootstrap();
