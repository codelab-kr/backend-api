import { Injectable } from '@nestjs/common';
import { HttpService, getDefaultFractionDigits } from '@app/common';
import { FeeService } from './fee.service';
import { QuoteRepository } from './repositories/quote.repository';
import { DeepPartial } from 'typeorm';
import { Quote } from './models/quote';
import { roundToDigits } from '@app/common';

@Injectable()
export class QuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly feeService: FeeService,
    private readonly httpService: HttpService,
  ) {}

  // /**
  //  * 모든 QUOTE 정보를 조회한다.
  //  *
  //  * @returns {Promise<Quote[]>}
  //  */
  // findAll(): Promise<Quote[]> {
  //   return this.quoteRepository.find({ relations: ['settings'] });
  // }

  // /**
  //  * QUOTE Id에 해당하는 QUOTE 정보를 조회한다.
  //  *
  //  * @param {number} id - QUOTE Id
  //  * @returns {Promise<QuoteResponseDto>}
  //  */
  // findById(id: number): Promise<Quote> {
  //   return this.findQuoteById(id);
  // }

  // /**
  //  * QUOTE Id에 해당하는 QUOTE 정보를 생성한다.
  //  *
  //  * @param {number} id - QUOTE Id
  //  * @param {QuoteUpdateRequestDto} requestDto - QUOTE 수정 Dto
  //  * @returns {Promise<Quote>}
  //  */
  async createQuote(targetCurrency: string, amount: number) {
    //Promise<Quote> {
    //   const quote = await this.findQuoteById(requestDto.id);
    //   const { userId } = requestDto;

    // 소수점 자리수는 Java Util Currency에서 제공하는 defaultFractionDigit 값을 이용합니다.
    // TypeScript에서는 Intl.NumberFormat을 사용해서 소수점 자리수를 구할 수 있습니다.
    // (e.g. KRW의 경우 0, JPY의 경우 0, USD의 경우 2)

    const fee = await this.getFees(targetCurrency, amount);
    const { usdExchangeRate, jpyExchangeRate } = await this.getExchangeRate();
    const exchangeRate =
      targetCurrency === 'JPY' ? jpyExchangeRate : usdExchangeRate;
    // TODO: usdAmount 의 기준 확인해야 함 -- (보내는 금액 - 수수료) / usd환율 인지, 보내는 금액 / usd환율 인지
    const usdAmount = roundToDigits(
      (amount - fee) / usdExchangeRate,
      getDefaultFractionDigits('USD'),
    );
    // 받는 금액 = (보내는 금액 - 수수료) / 환율
    const targetAmount = roundToDigits(
      (amount - fee) / exchangeRate,
      getDefaultFractionDigits(targetCurrency),
    );

    const quote = {
      sourceAmount: amount,
      fee,
      usdExchangeRate,
      usdAmount,
      targetCurrency,
      exchangeRate,
      targetAmount,
    } as DeepPartial<Quote>;

    const userId = 1; // TODO: 사용자 정보를 받아와야 함

    // 계산해서 결과 견적서 테이블에 저장하고 결과를 반환
    const createQuote = { ...quote, userId };
    return this.quoteRepository.save(createQuote);
  }

  // /**
  //  * QUOTE Id에 해당하는 QUOTE 정보를 반환한다.
  //  *
  //  * @param {number} id - QUOTE Id
  //  * @returns {Promise<Quote>}
  //  * @private
  //  */
  // private async findQuoteById(id: number): Promise<Quote> {
  //   const quote = await this.quoteRepository.findOne({
  //     where: { id },
  //     relations: ['settings'],
  //   });

  //   if (isEmpty(quote) === true) {
  //     throw new NotFoundException(Message.NOT_FOUND_QUOTE);
  //   }

  //   return quote;
  // }

  // /**
  //  * QUOTE Id에 해당하는 QUOTE 정보를 삭제한다.
  //  *
  //  * @param {number} id - QUOTE Id
  //  * @returns {Promise<void>}
  //  */
  // deleteQuote(id: number): void {
  //   this.quoteRepository.delete(id);
  // }

  // 환율 정보를 조회한다.
  //   https://quotation-api-cdn.dunamu.com:443/v1/forex
  // curl --location 'https://quotation-api-cdn.dunamu.com:443/v1/forex/recent?codes=,FRX.KRWJPY,FRX.KRWUSD'
  async getExchangeRate(): Promise<any> {
    // 환율은 받는 통화에서 보내는 통화로 사용 해주세요. (e.g USD_to_KRW = 1309.12)
    const exchangeRateData = await this.httpService.get(
      'https://quotation-api-cdn.dunamu.com:443/v1/forex/recent?codes=,FRX.KRWUSD,FRX.KRWJPY',
    );
    console.log('exchangeRateData:', exchangeRateData);
    if (exchangeRateData?.length < 2) {
      throw new Error('환율 정보 조회에 실패했습니다.');
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
  async getFees(targetCurrency: string, amount: number) {
    //: Promise<Fee> {
    const feeData = await this.feeService.findFees(targetCurrency, amount);
    const { feePerCase, feeRate } = feeData;
    // 수수료 = 보내는금액(amount) * 수수료율(feeRate) + 고정수수료 (feePerCase)
    const fee = roundToDigits(feePerCase + amount * feeRate, 0); // 소수점 0자리 반올림
    return fee;
  }
}
