import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { UserService } from './user.sevice';
import { lastValueFrom } from 'rxjs';
import { AuthGuard, CurrentUser, LocalAuthGuard, User } from '@app/common';
import { LoginUserRequest } from './dtos/login-user.request';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  async CreateUser(@Res() res: Response, @Body() createUserDto: User) {
    try {
      const result = await lastValueFrom(
        this.userService.createUser(createUserDto),
      );
      if (result) {
        res.status(HttpStatus.CREATED).send(result);
      }
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async loginSubmit(
    @Res({ passthrough: true }) res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _data: LoginUserRequest,
    @CurrentUser() user: any,
  ) {
    try {
      res.cookie('Authentication', user?.access_token, {
        maxAge: this.configService.get('EXPIRESIN'),
      });
    } catch (error) {
      // res.render('login', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  @ApiOkResponse({ description: '쿠키를 초기화 한다.' })
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('Authentication');
    res.setHeader('Set-Cookie', `Authentication=; HttpOnly; Path=/; Max-Age=0`);
    return res.status(HttpStatus.OK).send({ message: 'logout success' });
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
  updateUser(@Body() request: Partial<User>) {
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
