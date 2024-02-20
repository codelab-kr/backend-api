import { Repository } from 'typeorm';
import { CustomRepository } from '@app/common';
import { Fee } from '@app/common';

@CustomRepository(Fee)
export class FeeRepository extends Repository<Fee> {}
