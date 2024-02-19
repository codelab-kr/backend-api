import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, LocalAuthGuard } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { LoginUserRequest } from './users/dtos/login-user.request';

@ApiTags('API')
@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

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
      res.render('login', { error: error.message });
    }
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('Authentication');
  }
}
