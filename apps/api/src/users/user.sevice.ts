import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from '@app/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from '../../../user/src/dtos/update.user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  createUser(createUserDto: CreateUserDto) {
    try {
      return this.natsClient.send({ cmd: 'createUser' }, createUserDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  getUser() {
    try {
      return this.natsClient.send({ cmd: 'getUser' }, {});
    } catch (error) {
      throw new RpcException(error);
    }
  }

  getUserById(id: string) {
    try {
      return this.natsClient.send({ cmd: 'getUserById' }, id);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  getUserPayments(userId: string) {
    try {
      return this.natsClient.send({ cmd: 'getPaymentByUserId' }, { userId });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  updateUser(request: UpdateUserDto) {
    try {
      return this.natsClient.send({ cmd: 'updateUser' }, request);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  deleteUser(id: string) {
    try {
      return this.natsClient.send({ cmd: 'deleteUser' }, id);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
