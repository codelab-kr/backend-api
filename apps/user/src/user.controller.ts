import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { User } from '@app/common';
import { LoginUserRequest } from './dtos/login-user.request';

export interface TokenPayload {
  id: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @MessagePattern({ cmd: 'createUser' })
  async createUser(@Payload() data: User) {
    try {
      return await this.userService.createUser(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'validateUser' })
  async validateUser(@Payload() data: LoginUserRequest | TokenPayload) {
    try {
      return await this.userService.validateUser(data);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
