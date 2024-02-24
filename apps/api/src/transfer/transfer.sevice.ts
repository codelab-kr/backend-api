import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  CreateTransferRequest,
  FindTransfersRequest,
  NATS_SERVICE,
} from '@app/common';

@Injectable()
export class TransferService {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  async createTransfer(createTransferDto: CreateTransferRequest) {
    try {
      return this.natsClient.send({ cmd: 'createTransfer' }, createTransferDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findTransferList(data: FindTransfersRequest) {
    try {
      return this.natsClient.send({ cmd: 'findTransferList' }, data);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
