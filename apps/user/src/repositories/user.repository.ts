import { Repository } from 'typeorm';
import { CustomRepository } from '@app/common';
import { User } from '../models/user';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
