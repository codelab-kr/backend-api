import { Repository } from 'typeorm';
import { CustomRepository } from '@app/common';
import { Quote } from '../models/quote';

@CustomRepository(Quote)
export class QuoteRepository extends Repository<Quote> {}
