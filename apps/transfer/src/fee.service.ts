import { Injectable } from '@nestjs/common';
import { FeeRepository } from './repositories/fee.repository';
import { Fee } from './models/free';
import { Brackets } from 'typeorm';

@Injectable()
export class FeeService {
  constructor(private readonly feeRepository: FeeRepository) {}

  findFees(targetCurrency: string, amount: number): Promise<Fee> {
    return this.feeRepository
      .createQueryBuilder('fee')
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
