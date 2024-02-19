import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwagger } from '@app/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register(),
  );

  const conf = app.get(ConfigService);

  setSwagger(app);

  const port = conf.get('PORT') ?? 4000;
  const baseUrl = conf.get('BASE_URL');

  app.enableCors();

  await app.listen(port, () => console.log(`Listening on ${baseUrl} 🚀  `));
}
bootstrap();
