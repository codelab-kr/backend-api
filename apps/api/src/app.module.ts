import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule, ExceptionModule } from '@app/common';
import * as Joi from 'joi';
import { UserModule } from './users/user.module';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    const module = AppModule;

    const imports = [
      ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: Joi.object({
          SERVICE: Joi.string().required(),
        }),
        cache: true,
        envFilePath: 'apps/api/.env',
      }),
      ExceptionModule,
      UserModule,
    ];
    const AuthModule = JwtAuthModule;
    imports.push(AuthModule);

    return {
      module,
      imports,
    };
  }
}
