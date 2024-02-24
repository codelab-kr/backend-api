import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IdType,
  Transfer,
  Message,
  roundToDigits,
  CreateTransferRequest,
  FindTransfersRequest,
} from '@app/common';
import { QuoteService } from './quote.service';
import { TransferRepository } from './repositories/transfer.repository';

@Injectable()
export class TransferService {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly quoteService: QuoteService,
  ) {}

  /**
   * Transfer 요청을 생성한다.
   *
   * @param {CreateTransferRequest} data - Transfer 생성 Dto
   * @returns {Promise<Transfer>}
   * @throws {HttpException} quote 만료시 예외 발생
   * @throws {HttpException} Transfer 한도 초과시 예외 발생
   * @throws {HttpException} Transfer 생성 실패시 예외 발생
   */
  async createTransfer(data: CreateTransferRequest): Promise<any> {
    try {
      const quoteId = +data.quoteId;
      const foundQuote = await this.quoteService.findById(quoteId);
      const { expireTime, usdAmount, userId, idType } = foundQuote;

      // check quote expire
      if (expireTime.getTime() < new Date().getTime()) {
        throw new HttpException(Message.QUOTE_EXPIRED, HttpStatus.BAD_REQUEST);
      }

      // check transfer limit
      const { usdSum } = await this.findCountAndSum(userId, new Date());
      await this.transferLimitCheck(usdAmount, usdSum, idType);

      const requestDto = { usdAmount, quoteId, userId };
      const savedTransfer = await this.transferRepository.save(requestDto);
      return savedTransfer;
    } catch (error) {
      throw error;
    }
  }

  /**
   * check transfer limit - Transfer 한도를 체크한다.
   * - REG_NO: 1000 USD
   * - BUSINESS_NO: 5000 USD
   * @param {number} usdAmount - Transfer 요청한 usdAmount
   * @param {number} usdSum - userId와 date에 해당하는 Transfer 요약 정보의 usdSum
   * @param {IdType} idType - 사용자 ID Type
   * @returns {Promise<boolean>}
   * @throws {HttpException} Transfer 한도 초과시 예외 발생
   *
   */
  async transferLimitCheck(
    usdAmount: number,
    usdSum: number,
    idType: IdType,
  ): Promise<boolean> {
    if (
      (idType === IdType.REG_NO && usdSum + usdAmount > 1000) ||
      (idType === IdType.BUSINESS_NO && usdSum + usdAmount > 5000)
    ) {
      throw new HttpException(Message.LIMIT_EXCESS, HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  /**
   * Transfer 목록을 조회한다.
   *
   * @param {FindTransfersRequest} data - Transfer 조회 Dto
   * @returns {Promise<any>}
   * @throws {HttpException} Transfer 조회 실패시 예외 발생
   */
  async findTransferList(data: FindTransfersRequest): Promise<any> {
    try {
      const { userId, name, date } = data;
      let todayTransferUsdAmount: number = 0,
        todayTransferCount: number = 0,
        history = [];
      const findCountAndSum = await this.findCountAndSum(userId, date);
      if (findCountAndSum.count > 0) {
        todayTransferUsdAmount = roundToDigits(findCountAndSum.usdSum, 2);
        todayTransferCount = findCountAndSum.count;
        history = await this.findTransferHistory(userId, date);
      }
      return {
        userId,
        name,
        todayTransferCount,
        todayTransferUsdAmount,
        history,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Transfer Id에 해당하는 Transfer 정보를 반환한다.
   *
   * @param {number} transferId
   * @returns {Promise<Transfer>}
   */
  findByTransferId(transferId: number): Promise<Transfer> {
    return this.transferRepository.findOneBy({ id: transferId });
  }

  /**
   * userId와 date에 해당하는 Transfer 요약 정보를 반환한다.
   *
   * @param {string} userId
   * @param {Date} date
   * @returns {Promise<any>}
   */
  private async findCountAndSum(userId: string, date?: Date): Promise<any> {
    const { usdSum, count } = await this.transferRepository
      .createQueryBuilder('transfer')
      .where(
        'transfer.user_id = :userId AND DATE(transfer.requestedDate) = DATE(COALESCE(:date, date("now")))', // for sqlite
        { userId, date },
      )
      .select('SUM(transfer.usdAmount)', 'usdSum')
      .addSelect('COUNT(transfer.id)', 'count')
      .getRawOne();
    return { usdSum, count };
  }

  /**
   * userId와 date에 해당하는 Transfer 정보를 list 형태로 반환한다.
   *
   * @param {string} userId
   * @param {Date} date
   * @returns {Promise<any>}
   */
  async findTransferHistory(userId: string, date?: Date): Promise<any[]> {
    return this.transferRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('quote', 'quote', 'transfer.quoteId = quote.id')
      .where(
        'transfer.user_id = :userId AND DATE(transfer.requestedDate) = DATE(COALESCE(:date, date("now")))', // for sqlite
        { userId, date },
      )
      .select([
        'quote.source_amount as sourceAmount',
        'quote.fee as fee',
        'quote.usd_exchange_rate as usdExchangeRate',
        'quote.usd_amount as usdAmount',
        'quote.target_currency as targetCurrency',
        'quote.exchange_rate as exchangeRate',
        'quote.target_amount as targetAmount',
        'transfer.requested_date as requestedDate',
      ])
      .orderBy('transfer.requestedDate', 'ASC')
      .getRawMany();
  }
}
