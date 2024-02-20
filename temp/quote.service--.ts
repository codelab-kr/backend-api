import { NotFoundException, Injectable } from '@nestjs/common';
import { Quote } from '../apps/transfer/src/models/quote';
import { HttpService, isEmpty } from '@app/common';
import { QuoteRepository } from '../apps/transfer/src/repositories/quote.repository';
import { Message } from '@app/common';
import { CreateQuoteInput } from '../apps/transfer/src/utils/create.quota.input';
import { UpdateQuoteInput } from '../apps/transfer/src/utils/update.quota.input';
import { Fee } from '../apps/transfer/src/models/free';
import { FeeService } from '../apps/transfer/src/fee.service';

@Injectable()
export class QuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly feeService: FeeService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * QUOTE를 생성한다.
   *
   * @param {QuoteCreateRequestDto} requestDto - QUOTE 생성 Dto
   * @returns {Promise<Quote>}
   */

  createQuote(targetCurrency: string, amount: number): Promise<Quote> {
    const requestDto = new CreateQuoteInput();
    requestDto.targetCurrency = targetCurrency;
    requestDto.amount = amount;
    // fee 조회, api로 환율 가지고 와서, 계산해서 결과 견적서 테이블에 저장하고 결과를 반환
    return this.quoteRepository.save(requestDto);
  }

  /**
   * 모든 QUOTE 정보를 조회한다.
   *
   * @returns {Promise<Quote[]>}
   */
  findAll(): Promise<Quote[]> {
    return this.quoteRepository.find({ relations: ['settings'] });
  }

  /**
   * QUOTE Id에 해당하는 QUOTE 정보를 조회한다.
   *
   * @param {number} id - QUOTE Id
   * @returns {Promise<QuoteResponseDto>}
   */
  findById(id: number): Promise<Quote> {
    return this.findQuoteById(id);
  }

  /**
   * QUOTE Id에 해당하는 QUOTE 정보를 생성한다.
   *
   * @param {number} id - QUOTE Id
   * @param {QuoteUpdateRequestDto} requestDto - QUOTE 수정 Dto
   * @returns {Promise<Quote>}
   */
  async creatQuote(requestDto: UpdateQuoteInput): Promise<Quote> {
    const quote = await this.findQuoteById(requestDto.id);
    const { userId } = requestDto;
    const exchangeRate = await getExchangeRate(
      quote.targetCurrency,
      quote.amount,
    );
    const fee = await getFees(quote.targetCurrency, quote.amount);

    // 계산해서 결과 견적서 테이블에 저장하고 결과를 반환
    const createQuote = { ...quote, userId };
    return this.quoteRepository.save(createQuote);
  }

  /**
   * QUOTE Id에 해당하는 QUOTE 정보를 반환한다.
   *
   * @param {number} id - QUOTE Id
   * @returns {Promise<Quote>}
   * @private
   */
  private async findQuoteById(id: number): Promise<Quote> {
    const quote = await this.quoteRepository.findOne({
      where: { id },
      relations: ['settings'],
    });

    if (isEmpty(quote) === true) {
      throw new NotFoundException(Message.NOT_FOUND_QUOTE);
    }

    return quote;
  }

  /**
   * QUOTE Id에 해당하는 QUOTE 정보를 삭제한다.
   *
   * @param {number} id - QUOTE Id
   * @returns {Promise<void>}
   */
  deleteQuote(id: number): void {
    this.quoteRepository.delete(id);
  }

  // 환율 정보를 조회한다.
  //   https://quotation-api-cdn.dunamu.com:443/v1/forex
  // curl --location 'https://quotation-api-cdn.dunamu.com:443/v1/forex/recent?codes=,FRX.KRWJPY,FRX.KRWUSD'
  getExchangeRate(): Promise<any> {
    return this.httpService.get(
      'https://quotation-api-cdn.dunamu.com:443/v1/forex/recent?codes=,FRX.KRWJPY,FRX.KRWUSD',
    );
  }

  // 수수료 정보를 조회한다.
  findFees(id: number): Promise<Fee> {
    return this.findQuoteById(id);
  }
}
