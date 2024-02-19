import { Module } from '@nestjs/common';
import { NatsClientService } from './nats-client.service';
import { NATS_SERVICE } from '../constant/services';

@Module({
  providers: [{ provide: NATS_SERVICE, useClass: NatsClientService }],
  exports: [NATS_SERVICE],
})
export class NatsClientModule {}
