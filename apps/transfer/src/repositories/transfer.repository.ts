import { Repository } from 'typeorm';
import { CustomRepository } from '@app/common';
import { Transfer } from '../models/transfer';

@CustomRepository(Transfer)
export class TransferRepository extends Repository<Transfer> {}
