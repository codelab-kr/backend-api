import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { NATS_SERVICE } from '../../constant/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export interface TokenPayload {
  id: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(NATS_SERVICE) private readonly natsService: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          const authentication =
            request?.Authentication ||
            request?.headers?.authorization?.split(' ')[1] ||
            request?.headers?.cookie?.split('=')[1];
          return authentication;
        },
      ]),
      ignoreExpiresin: false,
      secretOrKey: configService.get('SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      console.log('payload', payload);
      const userFound = await lastValueFrom(
        this.natsService.send({ cmd: 'validateUser' }, payload),
      );

      if (!userFound) {
        // return null;
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPassword, ...user } = userFound;
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
