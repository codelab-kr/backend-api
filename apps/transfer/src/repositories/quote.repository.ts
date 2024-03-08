import { Repository } from 'typeorm';
import { CustomRepository, Quote } from '@app/common';

@CustomRepository(Quote)
export class QuoteRepository extends Repository<Quote> {}
