import { NestFactory } from '@nestjs/core';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { ValidationPipe } from '@nestjs/common';
import { UserModule } from './user.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setSwagger } from '@app/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // console.log('user service is starting');
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   UserModule,
  //   {
  //     transport: Transport.NATS,
  //     options: {
  //       servers: ['nats://nats'],
  //     },
  //   },
  // );
  // app.useGlobalPipes(new ValidationPipe());
  // await app.listen();

  const app = await NestFactory.create<NestExpressApplication>(UserModule);

  const conf = app.get(ConfigService);

  setSwagger(app);

  const service = conf.get('SERVICE');
  const port = conf.get('PORT') ?? 4001;
  const baseUrl = conf.get('BASE_URL');

  app.enableCors();

  await app.listen(port, () =>
    console.log(`${service} Server Listening on ${baseUrl} 🚀  `),
  );
}
bootstrap();
