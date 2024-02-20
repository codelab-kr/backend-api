import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MysqlModule, TypeOrmExModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SERVICE: Joi.string().required(),
      }),
      envFilePath: 'apps/user/.env',
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    MysqlModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
