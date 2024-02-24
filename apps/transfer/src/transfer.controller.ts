import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Transfer, CurrencyCode } from '@app/common';
import { QuoteService } from './quote.service';
import { TransferService } from './transfer.service';
import { createTransferRequest } from './dtos/request-transfer.dto';

@Controller('transfer')
@ApiTags('TRANSFER API')
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly quoteService: QuoteService,
  ) {}

  @Get('/quote/:target/:amount')
  @ApiOperation({ summary: 'QUOTE 조회 API' })
  @ApiOkResponse({ description: 'QUOTE를 조회한다.', type: Transfer })
  async getQuote(
    @Param('target') targetCurrency: CurrencyCode,
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
  async createTransfer(@Body() request: createTransferRequest) {
    const { quoteId, userId, idType } = request;
    return await this.transferService.createTransfer(quoteId, userId, idType);
  }

  @Get('/list')
  @ApiOperation({ summary: '오늘 TRANSFER 조회 API' })
  @ApiOkResponse({ description: '오늘 TRANSFER를 조회한다.', type: Transfer })
  //파라미터
  // JWT token
  async findTodayTransfer(@Param('userId') userId: string) {
    return await this.transferService.findTransfer(userId);
  }
}
