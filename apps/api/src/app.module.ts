import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule, ExceptionModule } from '@app/common';
import { UserModule } from './user/user.module';
import { TransferModule } from './transfer/transfer.module';
import * as Joi from 'joi';

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
      TransferModule,
    ];
    const AuthModule = JwtAuthModule;
    imports.push(AuthModule);

    return {
      module,
      imports,
    };
  }
}
