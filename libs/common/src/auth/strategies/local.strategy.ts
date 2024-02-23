import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../../constant/services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(NATS_SERVICE) private readonly natsService: ClientProxy) {
    // passportStrategy mixin
    super({ usernameField: 'id' });
  }

  async validate(id: string, password: string) {
    try {
      const userFound = await lastValueFrom(
        this.natsService.send({ cmd: 'validateUser' }, { id, password }),
      );

      if (!userFound) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPassword, ...user } = userFound;
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
