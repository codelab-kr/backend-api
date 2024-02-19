import { Module } from '@nestjs/common';
import { HttpModule as AxiosModule } from '@nestjs/axios';
import { HttpService } from './http.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AxiosModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT') ?? 5000,
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS') ?? 5,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
