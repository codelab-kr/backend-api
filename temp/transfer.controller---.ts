import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TransferService } from './transfer.service';
import { Transfer } from './models/transfer';
import { CreateTransferInput } from './utils/create.transfer.input';
import { QuoteService } from './quote.service--';

@Controller('transfer')
@ApiTags('TRANSFER API')
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly quoteService: QuoteService,
  ) {}

  // @Get('/fee')
  // @ApiOperation({ summary: 'FEE 조회 API' })
  // @ApiOkResponse({ description: 'FEE를 조회한다.', type: Transfer })
  // async findFee(@Param('id') id: number) {
  //   return await this.transferService.findFeeById(+id);
  // }

  @Get('/quote')
  @ApiOperation({ summary: 'QUOTE 조회 API' })
  @ApiOkResponse({ description: 'QUOTE를 조회한다.', type: Transfer })
  async createQuote(
    @Param('targetCurrency') targetCurrency: string,
    @Param('amount') amount: number,
  ) {
    return await this.quoteService.createQuote(targetCurrency, amount);
  }

  @Post('/request')
  @ApiOperation({
    summary: 'TRANSFER 생성 API',
    description: 'TRANSFER를 생성한다.',
  })
  @ApiCreatedResponse({ description: 'TRANSFER를 생성한다.', type: Transfer })
  // 파라미터
  // JWT token
  // quoteId (String) : 채번한 quote의 id
  async create(@Body() requestDto: CreateTransferInput) {
    return await this.transferService.createTransfer(requestDto);
  }

  @Get('/list')
  @ApiOperation({ summary: '모든 TRANSFER 조회 API' })
  @ApiOkResponse({ description: '모든 TRANSFER를 조회한다.', type: Transfer })
  //파라미터
  // JWT token
  async findTodayTransfer() {
    return await this.transferService.findTodayTransfer();
  }

  // @Get('/:id')
  // @ApiOperation({ summary: 'TRANSFER 조회 API' })
  // @ApiOkResponse({ description: 'TRANSFER을 조회한다.', type: Transfer })
  // async findOne(@Param('id') id: number) {
  //   return await this.transferService.findById(+id);
  // }

  // @Delete('/:id')
  // @ApiOperation({
  //   summary: 'TRANSFER 삭제 API',
  //   description: 'TRANSFER을 삭제한다.',
  // })
  // @ApiCreatedResponse({ description: 'TRANSFER를 생성한다.', type: Transfer })
  // delete(@Param('id') id: number) {
  //   return this.transferService.deleteTransfer(+id);
  // }
}
