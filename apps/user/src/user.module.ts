import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MysqlModule, TypeOrmExModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsRepository } from './repositories/payments.repository';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SERVICE_NAME: Joi.string().required(),
      }),
      envFilePath: 'apps/user/.env',
    }),
    TypeOrmExModule.forCustomRepository([UserRepository, PaymentsRepository]),
    MysqlModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
