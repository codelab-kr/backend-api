import { Inject, Injectable } from '@nestjs/common';
import { NATS_SERVICE } from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateQuoteRequest } from '../../../../libs/common/src/database/dto/transfer/create-quote.request';
// import { QuoteRepository } from './repositories/quote.repository';

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
