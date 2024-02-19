import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Patch,
  Delete,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';
import { UserService } from './user.sevice';
import { lastValueFrom } from 'rxjs';
import { UpdateUserRequest } from './dtos/update-user.request';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async CreateUser(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    try {
      const result = await lastValueFrom(
        this.userService.createUser(createUserDto),
      );
      if (result) {
        res.status(201).json(result);
      }
    } catch (error) {
      res.status(400, error.message);
    }
  }

  @Get()
  getUser() {
    try {
      return this.userService.getUser();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    try {
      return this.getUserById(id);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch()
  updateUser(@Body() request: UpdateUserRequest) {
    try {
      return this.userService.updateUser(request);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    try {
      return this.userService.deleteUser(id);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
