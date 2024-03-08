import { Repository, Brackets } from 'typeorm';
import { CustomRepository, Fee } from '@app/common';

@CustomRepository(Fee)
export class FeeRepository extends Repository<Fee> {
  findFees(targetCurrency: string, amount: number): Promise<Fee> {
    return this.createQueryBuilder('fee')
      .where('target_currency = :targetCurrency', { targetCurrency })
      .andWhere('amount_from <= :amount', { amount })
      .andWhere(
        new Brackets((qb) => {
          qb.where('amount_to > :amount', { amount }).orWhere(
            'amount_to IS NULL',
          );
        }),
      )
      .andWhere('is_valid = :isValid', { isValid: true })
      .getOne();
  }
}
