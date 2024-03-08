import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateQuoteRequest,
  HttpService,
  IdType,
  Message,
  getDefaultFractionDigits,
  isEmpty,
  Quote,
  roundToDigits,
} from '@app/common';
import { FeeService } from './fee.service';
import { DeepPartial } from 'typeorm';
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
   * @returns {Promise<any>}
   */
  async createQuote(data: CreateQuoteRequest): Promise<any> {
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

      const response = await this.quoteRepository.save(quote);
      if (isEmpty(response) === true) {
        throw new HttpException(
          Message.UNKNOWN_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        quoteId: response.id,
        exchangeRate,
        expireTime: response.expireTime,
        targetAmount,
      };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }

  /**
   *  송금액이 0보다 큰지 확인한다.
   * @param amount
   * @returns {Promise<void>}
   * @throws {HttpException} 송금액이 0보다 작을 경우 예외 발생
   */
  private async checkAmount(amount: number): Promise<boolean> {
    if (amount < 0) {
      throw new HttpException(Message.NEGATIVE_NUMBER, HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  /**
   * Quote 한도를 체크한다.
   * - REG_NO: 1000 USD
   * - BUSINESS_NO: 5000 USD
   * @param {number} usdAmount - Quote 요청한 usdAmount
   * @param {IdType} idType - 사용자 ID Type
   * @returns {Promise<boolean>}
   */
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

  /**
   * 환율 정보를 조회한다.
   * @returns {Promise<any>}
   */
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

  /**
   * 수수료 정보를 조회한다.
   *  fee = 보내는금액(amount) * 수수료율(feeRate) + 고정수수료 (feePerCase)
   * @param targetCurrency
   * @param amount
   * @returns {Promise<number>}
   */
  async getFees(targetCurrency: string, amount: number): Promise<number> {
    const feeData = await this.feeService.findFees(targetCurrency, amount);
    const { feePerCase, feeRate } = feeData;
    const fee = roundToDigits(amount * feeRate + feePerCase, 0);
    return fee;
  }

  /**
   * QuoteId에 해당하는 Quote 정보를 조회한다.
   * @param {number} id - QuoteId
   * @returns {Promise<Quote>}
   */
  findById(id: number): Promise<Quote> {
    return this.findQuoteById(id);
  }

  /** 
  /* QuoteId에 해당하는 Quote 정보를 조회한다.
  /* @param {number} id - QuoteId
  /* @returns {Promise<Quote>}
  */
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
