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
}
