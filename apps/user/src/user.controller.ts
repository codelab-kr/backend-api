import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TokenPayload, LoginUserRequest, CreateUserRequest } from '@app/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @MessagePattern({ cmd: 'createUser' })
  async createUser(@Payload() data: CreateUserRequest) {
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
