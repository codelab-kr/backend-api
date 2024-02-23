import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.sevice';
import { lastValueFrom } from 'rxjs';
import {
  AuthGuard,
  CurrentUser,
  LocalAuthGuard,
  User,
  result,
} from '@app/common';
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
  @ApiOkResponse({ description: 'User created' })
  async CreateUser(@Res() res: Response, @Body() createUserDto: User) {
    try {
      const response = await lastValueFrom(
        this.userService.createUser(createUserDto),
      );
      if (response) {
        res.status(HttpStatus.OK).json(result(HttpStatus.OK, 'OK'));
      }
    } catch (error) {
      res.status(error.status).json(result(error.status, error.message));
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ description: 'User login' })
  async loginSubmit(
    @Res({ passthrough: true }) res: Response,
    @Req() req: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _data: LoginUserRequest,
    @CurrentUser() user: any,
  ) {
    try {
      if (req?.errorData) {
        throw req.errorData.error;
      }
      res.cookie('Authentication', user?.access_token, {
        maxAge: this.configService.get('EXPIRESIN'),
      });
      res
        .status(HttpStatus.OK)
        .json({ ...result(HttpStatus.OK, 'OK'), token: user?.access_token });
    } catch (error) {
      res.status(error.status).json(result(error.status, error.message));
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'User logout' })
  async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('Authentication');
    res.setHeader('Set-Cookie', `Authentication=; HttpOnly; Path=/; Max-Age=0`);
    res.status(HttpStatus.OK).json(result(HttpStatus.OK, 'OK'));
  }

  // @Get()
  // getUser() {
  //   try {
  //     return this.userService.getUser();
  //   } catch (error) {
  //     throw new RpcException(error);
  //   }
  // }

  // @Get(':id')
  // getUserById(@Param('id') id: string) {
  //   try {
  //     return this.getUserById(id);
  //   } catch (error) {
  //     throw new RpcException(error);
  //   }
  // }

  // @Patch()
  // updateUser(@Body() request: Partial<User>) {
  //   try {
  //     return this.userService.updateUser(request);
  //   } catch (error) {
  //     throw new RpcException(error);
  //   }
  // }

  // @Delete(':id')
  // deleteUser(@Param('id') id: string) {
  //   try {
  //     return this.userService.deleteUser(id);
  //   } catch (error) {
  //     throw new RpcException(error);
  //   }
  // }
}
