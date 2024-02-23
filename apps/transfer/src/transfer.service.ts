import { Injectable } from '@nestjs/common';
import { IdType, Transfer, Message } from '@app/common';
import { QuoteService } from './quote.service';
import { TransferRepository } from './repositories/transfer.repository';

@Injectable()
export class TransferService {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly quoteService: QuoteService,
  ) {}

  /**
   * TRANSFER Transfer를 생성한다.
   *
   * @param {CreateTransferInput} requestDto - TRANSFER Transfer를 생성 Dto
   * @returns {Promise<Transfer>}
   */

  // 송금요청 생성 (한도 체크 포함하기)
  // 유저는 미국과 일본으로 송금을 할 수 있어요.
  // 개인 유저의 1일 한도는 $1000 (1천 달러)
  // 법인 유저의 1일 한도는 $5000 (5천 달러)
  async createTransfer(
    quoteId: number,
    userId: string,
    idType: IdType,
  ): Promise<any> {
    const foundQuote = await this.quoteService.findById(quoteId);
    const { createdAt, usdAmount } = foundQuote;
    if (createdAt.getTime() + 10 * 60 * 1000 < new Date().getTime()) {
      throw new Error(Message.QUOTE_EXPIRED);
    }
    const { usdSum } = await this.findTodayCountAndSum(userId);
    await this.transferLimitCheck(usdAmount, usdSum, idType);

    const requestDto = {
      usdAmount,
      quoteId,
      userId,
    };

    const savedTransfer = await this.transferRepository.save(requestDto);
    return savedTransfer;
  }

  /**
   * TRANSFER Id에 해당하는 TRANSFER Transfer 정보를 반환한다.
   *
   * @param {number} transferId - TRANSFER Id
   * @returns {Promise<Transfer>}
   */
  findByTransferId(transferId: number): Promise<Transfer> {
    return this.transferRepository.findOneBy({ id: transferId });
  }

  // 한도체크
  async transferLimitCheck(
    usdAmount: number,
    usdSum: number,
    idType: IdType,
  ): Promise<boolean> {
    if (idType === 'REG_NO' && usdSum + usdAmount > 1000) {
      throw new Error(Message.LIMIT_EXCESS);
    }

    if (idType === 'BUSINESS_NO' && usdSum + usdAmount > 5000) {
      throw new Error(Message.LIMIT_EXCESS);
    }
    return true;
  }

  async findTransfer(userId: string): Promise<any> {
    const { sum: todayTransferUsdAmount, count: todayTransferCount } =
      await this.findTodayCountAndSum(userId);
    const history = await this.findTransferHistory(userId);
    return { todayTransferUsdAmount, todayTransferCount, history };
  }

  /**
   * 오늘 TRANSFER Transfer 정보를 반환한다.
   *
   */
  async findTodayCountAndSum(userId: string): Promise<any> {
    const { sum: usdSum, count } = await this.transferRepository
      .createQueryBuilder('transfer')
      .where(
        'transfer.user_id = :userId AND DATE(transfer.createdAt) = CURDATE()',
        { userId },
      )
      .select('SUM(transfer.usdAmount)', 'sum')
      .addSelect('COUNT(transfer.id)', 'count')
      .getRawOne();
    return { usdSum, count };
  }

  async findTransferHistory(userId: string): Promise<any[]> {
    return this.transferRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.quote', 'quote')
      .where(
        'transfer.user_id = :userId AND DATE(transfer.created_at) = CURDATE()',
        { userId },
      )
      .select([
        'quote.sourceAmount',
        'quote.fee',
        'quote.usdExchangeRate',
        'quote.usdAmount',
        'quote.targetCurrency',
        'quote.exchangeRate',
        'quote.targetAmount',
        'transfer.createdAt',
      ])
      .orderBy('transfer.created_at', 'ASC')
      .getRawMany();
  }
}
