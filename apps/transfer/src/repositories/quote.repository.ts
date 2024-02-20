import { Repository } from 'typeorm';
import { CustomRepository } from '@app/common';
import { Quote } from '@app/common';

@CustomRepository(Quote)
export class QuoteRepository extends Repository<Quote> {}
