import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateQuoteRequest,
  HttpService,
  IdType,
  Message,
  getDefaultFractionDigits,
  isEmpty,
} from '@app/common';
import { FeeService } from './fee.service';
import { DeepPartial } from 'typeorm';
import { Quote } from '@app/common';
import { roundToDigits } from '@app/common';
import { QuoteRepository } from './repositories/quote.repository';

@Injectable()
export class QuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly feeService: FeeService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Quote를 생성한다.
   *
   * @param {CreateQuoteRequest} data - Quote 생성 Dto
   * @returns {Promise<Quote>}
   */
  async createQuote(data: CreateQuoteRequest): Promise<Quote> {
    try {
      const { targetCurrency, amount, userId, idType } = data;
      await this.checkAmount(amount);

      // fee
      const fee = await this.getFees(targetCurrency, amount);
      await this.checkAmount(amount - fee);

      // exchangeRate
      const { usdExchangeRate, jpyExchangeRate } = await this.getExchangeRate();
      const exchangeRate =
        targetCurrency === 'JPY' ? jpyExchangeRate : usdExchangeRate;

      // usdAmount = (amount - fee) / usdExchangeRate
      const usdAmount = roundToDigits(
        (amount - fee) / usdExchangeRate,
        getDefaultFractionDigits('USD'),
      );
      await this.checkAmount(usdAmount);
      await this.quoteLimitCheck(usdAmount, idType); // added function (quoteLimitCheck)

      // usdAmount = (amount - fee) / exchangeRate
      const targetAmount = roundToDigits(
        (amount - fee) / exchangeRate,
        getDefaultFractionDigits(targetCurrency),
      );
      await this.checkAmount(targetAmount);

      // quote
      const quote = {
        sourceAmount: amount,
        fee,
        usdExchangeRate,
        usdAmount,
        targetCurrency,
        exchangeRate,
        targetAmount,
        createdAt: new Date(),
        expireTime: new Date(new Date().getTime() + 10 * 60 * 1000),
        userId,
        idType,
      } as DeepPartial<Quote>;

      return await this.quoteRepository.save(quote);
    } catch (error) {
      console.log('error:', error);
      throw error;
    }
  }

  // 송금액이 0보다 큰지 확인한다.
  private async checkAmount(amount: number) {
    if (amount < 0) {
      throw new HttpException(Message.NEGATIVE_NUMBER, HttpStatus.BAD_REQUEST);
    }
  }

  // 송금액이 한도 내의 금액인지 확인한다.
  private async quoteLimitCheck(
    usdAmount: number,
    idType: IdType,
  ): Promise<boolean> {
    if (
      (idType === IdType.REG_NO && usdAmount > 1000) ||
      (idType === IdType.BUSINESS_NO && usdAmount > 5000)
    ) {
      throw new HttpException(Message.LIMIT_EXCESS, HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  // 환율 정보를 조회한다.
  async getExchangeRate(): Promise<any> {
    const exchangeRateData = await this.httpService.get(
      'https://quotation-api-cdn.dunamu.com:443/v1/forex/recent?codes=,FRX.KRWUSD,FRX.KRWJPY',
    );
    if (exchangeRateData?.length < 2) {
      throw new HttpException(
        Message.UNKNOWN_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const { basePrice: basePriceUsd, currencyUnit: currencyUnitUsd } =
      exchangeRateData[0];
    const { basePrice: basePriceJpy, currencyUnit: currencyUnitJpy } =
      exchangeRateData[1];
    const usdExchangeRate = roundToDigits(basePriceUsd / currencyUnitUsd, 2);
    const jpyExchangeRate = roundToDigits(basePriceJpy / currencyUnitJpy, 2);
    return {
      usdExchangeRate,
      jpyExchangeRate,
    };
  }

  // 수수료 정보를 조회한다.
  // fee = 보내는금액(amount) * 수수료율(feeRate) + 고정수수료 (feePerCase)
  async getFees(targetCurrency: string, amount: number): Promise<number> {
    const feeData = await this.feeService.findFees(targetCurrency, amount);
    const { feePerCase, feeRate } = feeData;
    const fee = roundToDigits(amount * feeRate + feePerCase, 0);
    return fee;
  }

  /**
   * QUOTE Id에 해당하는 QUOTE 정보를 조회한다.
   *
   * @param {number} id - QUOTE Id
   * @returns {Promise<Quote>}
   */
  findById(id: number): Promise<Quote> {
    return this.findQuoteById(id);
  }

  // QUOTE Id에 해당하는 QUOTE 정보를 조회한다.
  private async findQuoteById(id: number): Promise<Quote> {
    const quote = await this.quoteRepository.findOneBy({ id });

    if (isEmpty(quote) === true) {
      throw new HttpException(
        Message.UNKNOWN_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return quote;
  }
}
