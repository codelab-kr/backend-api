import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE, CreateUserRequest } from '@app/common';

@Injectable()
export class UserService {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  createUser(createUserDto: CreateUserRequest) {
    try {
      return this.natsClient.send({ cmd: 'createUser' }, createUserDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
