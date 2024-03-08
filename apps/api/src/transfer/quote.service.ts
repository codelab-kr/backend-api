import { Inject, Injectable } from '@nestjs/common';
import { NATS_SERVICE, CreateQuoteRequest } from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class QuoteService {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  async createQuote(createQuoteRequest: CreateQuoteRequest) {
    try {
      return this.natsClient.send({ cmd: 'createQuote' }, createQuoteRequest);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
