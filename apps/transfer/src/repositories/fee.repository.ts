import { Repository } from 'typeorm';
import { CustomRepository } from '@app/common';
import { Fee } from '../models/free';

@CustomRepository(Fee)
export class FeeRepository extends Repository<Fee> {}
