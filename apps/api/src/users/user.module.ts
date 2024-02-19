import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { NATS_SERVICE, NatsClientService } from '@app/common';
import { UserService } from './user.sevice';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: NATS_SERVICE,
      useClass: NatsClientService,
    },
    UserService,
  ],
})
export class UserModule {}
