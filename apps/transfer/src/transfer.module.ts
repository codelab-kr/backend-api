import { Module } from '@nestjs/common';
import { TransferRepository } from './repositories/transfer.repository';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { TypeOrmExModule, MysqlModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { TransferettingsRepository } from './repositories/transfer.settings.repository';
import { TransferettingsService } from './transfer.settings.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SERVICE_NAME: Joi.string().required(),
      }),
      envFilePath: 'apps/transfer/.env',
    }),
    TypeOrmExModule.forCustomRepository([
      TransferRepository,
      TransferettingsRepository,
    ]),
    MysqlModule,
  ],
  controllers: [TransferController],
  providers: [TransferService, TransferettingsService],
})
export class TransferModule {}
