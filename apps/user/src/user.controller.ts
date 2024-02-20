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
import {
  MessagePattern,
  EventPattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { CreateUserDto } from './dtos/create.user.dto';
import { LoginUserRequest } from './dtos/login.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { User } from '@app/common';

export interface TokenPayload {
  userId: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @MessagePattern({ cmd: 'createUser' })
  async createUser(@Payload() data: CreateUserDto) {
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

  @Get(':email')
  @MessagePattern({ cmd: 'getUserByEmail' })
  async getUserByEmail(
    @Payload() email: string,
    @Param('id') paramEmail?: string,
  ) {
    return await this.userService.getUserByEmail(paramEmail ?? email);
  }

  @Get()
  @MessagePattern({ cmd: 'getUser' })
  async getUser(): Promise<User[]> {
    return await this.userService.getUser();
  }

  @Post('get-or-saver')
  @MessagePattern({ cmd: 'getOrSaveUser' })
  async getOrSaveUser(@Payload() data: CreateUserDto) {
    return await this.userService.getOrSaveUser(data);
  }

  @Patch()
  @MessagePattern({ cmd: 'updateUser' })
  updateUser(@Body() request: UpdateUserDto): Promise<any> {
    return this.userService.updateUser(request);
  }

  @EventPattern('paymentCreated')
  handlePaymentCreated(@Payload() data: any): Promise<any> {
    const { userId: id, id: paymentId } = data;
    return this.userService.updateUser({ id, paymentId });
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
