import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { NATS_SERVICE, NatsClientService } from '@app/common';
import { TransferService } from './transfer.sevice';
import { QuoteService } from './quote.service';

@Module({
  controllers: [TransferController],
  providers: [
    {
      provide: NATS_SERVICE,
      useClass: NatsClientService,
    },
    TransferService,
    QuoteService,
  ],
})
export class TransferModule {}
