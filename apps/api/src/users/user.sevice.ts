import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE, User } from '@app/common';

@Injectable()
export class UserService {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  createUser(createUserDto: User) {
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

  updateUser(request: Partial<User>) {
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
