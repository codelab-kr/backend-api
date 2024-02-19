import { Injectable } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';
import * as os from 'os';

@Injectable()
export class NatsClientService {
  @Client({
    transport: Transport.NATS,
    options: {
      servers: [os.platform() === 'linux' ? 'nats://nats' : 'localhost'],
    },
  })
  client: ClientProxy;

  send(pattern: any, data: any) {
    return this.client.send(pattern, data);
  }

  emit(pattern: any, data: any) {
    return this.client.emit(pattern, data);
  }
}
