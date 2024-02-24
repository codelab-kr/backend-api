import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { ConfigService } from '@nestjs/config';
import { setValidation } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats'],
      },
    },
  );
  const service = app.get(ConfigService).get('SERVICE').toUpperCase();
  setValidation(app);
  console.log(`${service} Server Started 🚀  `);
  await app.listen();

  /* for independent run */
  /*
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
  */
}
bootstrap();
