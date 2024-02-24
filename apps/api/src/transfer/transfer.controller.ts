import {
  Controller,
  Res,
  UseGuards,
  HttpStatus,
  Get,
  Param,
  Req,
  HttpException,
  Body,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { TransferService } from './transfer.sevice';
import { lastValueFrom } from 'rxjs';
import {
  AuthGuard,
  result,
  CurrencyCode,
  Message,
  CreateQuoteRequest,
  CreateTransferRequest,
} from '@app/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { QuoteService } from './quote.service';

@Controller('transfer')
@ApiTags('TRANSFER')
export class TransferController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly transferService: TransferService,
  ) {}

  @Get('/quote/:target/:amount')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '견적(QUOTE)' })
  @ApiOkResponse({ description: 'quote calulated' })
  async getQuote(
    @Req() req: any,
    @Res() res: Response,
    @Param('target') targetCurrency: CurrencyCode,
    @Param('amount') amount: number,
  ) {
    try {
      if (req?.errorData || !req?.user) {
        throw new HttpException(
          Message.INVAILID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const data: CreateQuoteRequest = {
        targetCurrency,
        amount,
        userId: req?.user?.id,
        idType: req?.user?.idType,
      };
      const response = await lastValueFrom(
        await this.quoteService.createQuote(data),
      );
      if (response) {
        const data = { quote: { ...response } };
        console.log('data', data);
        res.status(HttpStatus.OK).json(result(HttpStatus.OK, 'OK', data));
      }
    } catch (error) {
      console.log('error', error);
      res.status(error.status).json(result(error.status, error.message));
    }
  }

  @Post('/request')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '송금요청(TRANSFER)' })
  @ApiOkResponse({ description: 'transfer submited' })
  async createTransfer(
    @Req() req: any,
    @Res() res: Response,
    @Body() data: CreateTransferRequest,
  ) {
    try {
      if (req?.errorData || !req?.user) {
        throw new HttpException(
          Message.INVAILID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const response = await lastValueFrom(
        await this.transferService.createTransfer(data),
      );
      if (response) {
        res.status(HttpStatus.OK).json(result(HttpStatus.OK, 'OK'));
      }
    } catch (error) {
      console.log('error', error);
      res.status(error.status).json(result(error.status, error.message));
    }
  }

  @Get('/list')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '송금요청(TRANSFER) 목록' })
  @ApiOkResponse({ description: 'list for todays transfer returnd' })
  async findTransferList(@Req() req: any, @Res() res: Response) {
    try {
      if (req?.errorData || !req?.user) {
        throw new HttpException(
          Message.INVAILID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const { id: userId, name } = req?.user;
      console.log('userId', userId);
      const response = await lastValueFrom(
        await this.transferService.findTransferList({
          userId,
          name,
          date: new Date(),
        }),
      );
      if (response) {
        res.status(HttpStatus.OK).json(result(HttpStatus.OK, 'OK', response));
      }
    } catch (error) {
      console.log('error', error);
      res.status(error.status).json(result(error.status, error.message));
    }
  }
}
