import { Injectable } from '@nestjs/common';
import { Fee } from '@app/common';
import { FeeRepository } from './repositories/fee.repository';

@Injectable()
export class FeeService {
  constructor(private readonly feeRepository: FeeRepository) {}

  findFees(targetCurrency: string, amount: number): Promise<Fee> {
    return this.feeRepository.findFees(targetCurrency, amount);
  }
}
