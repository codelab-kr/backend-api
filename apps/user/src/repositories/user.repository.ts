import { Repository } from 'typeorm';
import { CustomRepository, User } from '@app/common';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
