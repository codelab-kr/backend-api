import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User, Message } from '@app/common';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(request: User) {
    try {
      const existUser = await this.userRepository.findOneBy({
        id: request.id,
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
        throw new Error();
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
      if (data.id) {
        const id = data.id;
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
          // return null;
          throw new Error();
        }
        const { password: hashedPassword, ...userInfo } = user;
        if (data.password) {
          const password = data.password;
          const passwordIsVal = await bcrypt.compare(password, hashedPassword);
          if (!passwordIsVal) {
            // return null;
            throw new Error();
          }
        }
        return userInfo;
      }
    } catch (error) {
      throw new HttpException(Message.BAD_PARAMETERS, HttpStatus.BAD_REQUEST);
    }
  }

  // async getUser() {
  //   // return this.userRepository.find({ relations: ['payments'] });
  //   return this.userRepository.find();
  // }

  // async getUserById(id: string): Promise<User> {
  //   const user = await this.userRepository.findOneBy({ id });

  //   if (isEmpty(user) === true) {
  //     throw new UnprocessableEntityException(Message.BAD_PARAMETERS);
  //   }

  //   return user;
  // }

  // async updateUser(request: Partial<User>) {
  //   const user = await this.getUserById(request.id);
  //   const updateRequst = { ...user, ...request };
  //   if (request.password) {
  //     updateRequst.password = await bcrypt.hash(request.password, 10);
  //   }
  //   if (request.idValue) {
  //     updateRequst.idValue = await bcrypt.hash(request.idValue, 10);
  //   }
  //   const updatedResult = await this.userRepository.update(
  //     updateRequst.id,
  //     updateRequst,
  //   );

  //   return updatedResult;
  // }

  // async deleteUser(id: string) {
  //   const deletedResult = await this.userRepository.softDelete({ id });
  //   return deletedResult;
  // }

  // async getOrSaveUser(data: User) {
  //   const foundUser = await this.getUserById(data.id);
  //   if (foundUser) {
  //     return foundUser;
  //   }
  //   return this.userRepository.save(data);
  // }
}
