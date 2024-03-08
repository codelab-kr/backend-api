import { Repository } from 'typeorm';
import { CustomRepository, Transfer } from '@app/common';

@CustomRepository(Transfer)
export class TransferRepository extends Repository<Transfer> {
  /**
   * userId와 date에 해당하는 Transfer 요약 정보를 반환한다.
   *
   * @param {string} userId
   * @param {Date} date
   * @returns {Promise<any>}
   */
  async findCountAndSum(userId: string, date?: Date): Promise<any> {
    const { usdSum, count } = await this.createQueryBuilder('transfer')
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
    return this.createQueryBuilder('transfer')
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
