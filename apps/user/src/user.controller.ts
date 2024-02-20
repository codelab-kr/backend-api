import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
  validateUser(@Payload() data: LoginUserRequest | TokenPayload) {
    return this.userService.validateUser(data);
  }

  @Get(':id')
  @MessagePattern({ cmd: 'getUserById' })
  async getUserById(@Payload() id: string, @Param('id') paramId?: string) {
    return await this.userService.getUserById(paramId ?? id);
  }

  @Get()
  @MessagePattern({ cmd: 'getUser' })
  async getUser(): Promise<User[]> {
    return await this.userService.getUser();
  }

  @Post('get-or-saver')
  @MessagePattern({ cmd: 'getOrSaveUser' })
  async getOrSaveUser(@Payload() data: User) {
    return await this.userService.getOrSaveUser(data);
  }

  @Patch()
  @MessagePattern({ cmd: 'updateUser' })
  updateUser(@Body() request: Partial<User>): Promise<any> {
    return this.userService.updateUser(request);
  }

  @Delete(':id')
  @MessagePattern({ cmd: 'deleteUser' })
  deleteUser(
    @Payload() id: string,
    @Param('id') paramId?: string,
  ): Promise<any> {
    return this.userService.deleteUser(paramId ?? id);
  }
}
