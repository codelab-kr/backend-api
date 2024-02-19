import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { NatsClientModule } from '../nats-client/nats-client.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { NATS_SERVICE } from '../constant/services';
import { NatsClientService } from '../nats-client/nats-client.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    NatsClientModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRET'),
        signOptions: {
          expiresIn: `${configService.get('EXPIRESIN')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [NATS_SERVICE, LocalAuthGuard, AuthGuard],
  providers: [
    {
      provide: NATS_SERVICE,
      useClass: NatsClientService,
    },
    LocalAuthGuard,
    AuthGuard,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class JwtAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
