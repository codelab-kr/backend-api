import { Module } from '@nestjs/common';
import { TransferRepository } from './repositories/transfer.repository';
import { TransferController } from './transfer.controller';
import { FeeService } from './fee.service';
import { TypeOrmExModule, MysqlModule, HttpModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { QuoteRepository } from './repositories/quote.repository';
import { QuoteService } from './quote.service';
import * as Joi from 'joi';
import { FeeRepository } from './repositories/fee.repository';

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
      QuoteRepository,
      FeeRepository,
    ]),
    MysqlModule,
    HttpModule,
  ],
  controllers: [TransferController],
  providers: [FeeService, QuoteService],
})
export class TransferModule {}
