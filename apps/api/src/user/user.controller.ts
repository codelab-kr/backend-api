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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserRequest } from '@app/common';
import { ConfigService } from '@nestjs/config';

@Controller('user')
@ApiTags('USER')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
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
  @ApiOperation({ summary: '로그인' })
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
        .json(result(HttpStatus.OK, 'OK', { token: user?.access_token }));
    } catch (error) {
      res.status(error.status).json(result(error.status, error.message));
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({ description: 'User logout' })
  async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('Authentication');
    res.setHeader('Set-Cookie', `Authentication=; HttpOnly; Path=/; Max-Age=0`);
    res.status(HttpStatus.OK).json(result(HttpStatus.OK, 'OK'));
  }
}
