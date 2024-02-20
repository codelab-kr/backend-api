import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dtos/update.user.dto';
import { CreateUserDto } from './dtos/create.user.dto';
import { isEmpty } from 'class-validator';
import { Message } from '@app/common';
import { User } from '@app/common';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(request: CreateUserDto) {
    await this.validateCreateUserRequest(request);
    try {
      const seveUser = await this.userRepository.save({
        ...request,
        password: await bcrypt.hash(request.password, 10),
      });
      if (!seveUser) {
        throw new InternalServerErrorException(Message.BAD_PARAMETERS);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = seveUser;
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async validateCreateUserRequest(request: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      email: request.email,
    });

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async getUser() {
    return this.userRepository.find({ relations: ['payments'] });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (isEmpty(user) === true) {
      throw new UnprocessableEntityException(Message.BAD_PARAMETERS);
    }

    return user;
  }

  async updateUser(request: UpdateUserDto) {
    const user = await this.getUserById(request.id);
    const updateRequst = { ...user, ...request };
    if (request.password) {
      updateRequst.password = await bcrypt.hash(request.password, 10);
    }
    const updatedResult = await this.userRepository.update(
      updateRequst.id,
      updateRequst,
    );

    return updatedResult;
  }

  async deleteUser(id: string) {
    const deletedResult = await this.userRepository.softDelete({ id });
    return deletedResult;
  }

  async validateUser(data: any) {
    // for passport-jwt strategy to validate user
    if (data.userId) {
      const user = await this.userRepository.findOneBy({
        id: data.userId,
      });
      if (!user) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userInfo } = user;
      return userInfo;
    }

    // for passport-local strategy to validate user
    if (data.email && data.password) {
      const { email, password } = data;
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        return null;
      }
      const { password: hashedPassword, ...userInfo } = user;
      const passwordIsVal = await bcrypt.compare(password, hashedPassword);
      if (!passwordIsVal) {
        return null;
      }
      return userInfo;
    }
  }

  async getOrSaveUser(data: CreateUserDto) {
    const foundUser = await this.getUserByEmail(data.email);
    if (foundUser) {
      return foundUser;
    }
    return this.userRepository.save(data);
  }
}
