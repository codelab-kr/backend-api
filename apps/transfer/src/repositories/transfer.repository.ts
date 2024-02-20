import { Repository } from 'typeorm';
import { CustomRepository } from '@app/common';
import { Transfer } from '@app/common';

@CustomRepository(Transfer)
export class TransferRepository extends Repository<Transfer> {}
