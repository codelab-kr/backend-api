import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './mysql.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmExModule } from '../typeorm-ex/typeorm-ex.module';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...new TypeOrmConfigService(configService).dataSourceOptions,
      }),
      inject: [ConfigService],
    }),
    TypeOrmExModule,
  ],
})
export class MysqlModule {}
