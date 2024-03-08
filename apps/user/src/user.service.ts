import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserRequest, Message, User } from '@app/common';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(request: CreateUserRequest): Promise<Partial<User>> {
    try {
      const existUser = await this.userRepository.findOneBy({
        email: request.email,
      });
      if (existUser) {
        throw new HttpException(Message.BAD_PARAMETERS, HttpStatus.BAD_REQUEST);
      }
      const seveUser = await this.userRepository.save({
        ...request,
        password: await bcrypt.hash(request.password, 10),
        idValue: await bcrypt.hash(request.idValue, 10),
      });
      if (!seveUser) {
        throw new HttpException(Message.BAD_PARAMETERS, HttpStatus.BAD_REQUEST);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, idValue, ...user } = seveUser;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async validateUser(data: any) {
    try {
      // for jwt strategy
      if (data.id) {
        const { id } = data;
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
          throw new HttpException(
            Message.INVAILID_TOKEN,
            HttpStatus.UNAUTHORIZED,
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: hashedPassword, idValue, ...userInfo } = user;
        return userInfo;
      }

      // for local strategy
      if (!data.email || !data.password) {
        return null;
      }
      const { email, password } = data;
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new HttpException(
          Message.INVAILID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: hashedPassword, idValue, ...userInfo } = user;
      const passwordIsVal = await bcrypt.compare(password, hashedPassword);
      if (!passwordIsVal) {
        throw new HttpException(Message.BAD_PARAMETERS, HttpStatus.BAD_REQUEST);
      }
      return userInfo;
    } catch (error) {
      throw error;
    }
  }
}
