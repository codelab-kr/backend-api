import { Repository } from 'typeorm';
import { CustomRepository } from '@app/common';
import { Transferettings } from '../models/transfer.settings';

@CustomRepository(Transferettings)
export class TransferettingsRepository extends Repository<Transferettings> {}
