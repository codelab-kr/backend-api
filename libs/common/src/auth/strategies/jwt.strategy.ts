import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { NATS_SERVICE } from '../../constant/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export interface TokenPayload {
  userId: string;
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
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiresin: false,
      secretOrKey: configService.get('SECRET'),
    });
  }

  async validate(payload: any) {
    let userFound: any;
    try {
      userFound = await lastValueFrom(
        this.natsService.send({ cmd: 'validateUser' }, payload),
      );
    } catch (error) {
      throw new UnauthorizedException('Something went wrong');
    }
    if (!userFound) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...user } = userFound;
    return user;
  }
}
