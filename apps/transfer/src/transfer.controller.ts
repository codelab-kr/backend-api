import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { TransferService } from './transfer.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  CreateQuoteRequest,
  CreateTransferRequest,
  FindTransfersRequest,
} from '@app/common';

@Controller('transfer')
export class TransferController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly transferService: TransferService,
  ) {}

  @Post()
  @MessagePattern({ cmd: 'createQuote' })
  async createQuote(@Payload() data: CreateQuoteRequest) {
    try {
      return await this.quoteService.createQuote(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post()
  @MessagePattern({ cmd: 'createTransfer' })
  async createTransfer(@Body() data: CreateTransferRequest) {
    try {
      return await this.transferService.createTransfer(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @MessagePattern({ cmd: 'findTransferList' })
  async findTransferList(@Payload() data: FindTransfersRequest) {
    try {
      return await this.transferService.findTransferList(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
