import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { FeeService } from './fee.service';
import { ConfigModule } from '@nestjs/config';
import { QuoteService } from './quote.service';
import { TransferService } from './transfer.service';
import { FeeRepository } from './repositories/fee.repository';
import { QuoteRepository } from './repositories/quote.repository';
import { TransferRepository } from './repositories/transfer.repository';
import { TypeOrmExModule, SqlModule, HttpModule } from '@app/common';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SERVICE: Joi.string().required(),
      }),
      envFilePath: 'apps/transfer/.env',
    }),
    TypeOrmExModule.forCustomRepository([
      TransferRepository,
      QuoteRepository,
      FeeRepository,
    ]),
    SqlModule,
    HttpModule,
  ],
  controllers: [TransferController],
  providers: [FeeService, QuoteService, TransferService],
})
export class TransferModule {}
