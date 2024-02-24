import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SqlFormatterLogger } from '../../logger/sql.formatter.logger';
import { CustomNamingStrategy } from '../typeorm-ex/typeorm-ex.strategy';
import * as os from 'os';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  get(key: string): string {
    return this.configService.get(key);
  }

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV');
  }

  get dataSourceOptions(): DataSourceOptions {
    const dataSourceSqlite: DataSourceOptions = {
      type: 'sqlite',
      database:
        this.nodeEnv === 'test'
          ? ':memory:'
          : `./databases/sqlite/${this.nodeEnv}/${this.get('SERVICE')}.sqlite`,
      namingStrategy: new CustomNamingStrategy(),
      entities: [`./dist/libs/common/src/database/model/*`],
      logging:
        this.nodeEnv === 'production'
          ? ['error']
          : ['error', 'query', 'schema'],
      synchronize: true,
      maxQueryExecutionTime: 1000,
      logger: new SqlFormatterLogger(),
    };

    const dataSourceMysql: DataSourceOptions = {
      type: 'mysql',
      host: os.platform() === 'linux' ? this.get('DB_HOST') : 'localhost',
      port: parseInt(this.get('DB_PORT'), 10) ?? 3306,
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.nodeEnv === 'test' ? 'test' : this.get('DB_NAME'),
      namingStrategy: new CustomNamingStrategy(),
      entities: [`./dist/libs/common/src/database/model/*`],
      logging:
        this.nodeEnv === 'production'
          ? ['error']
          : ['error', 'query', 'schema'],
      synchronize: this.nodeEnv !== 'production',
      maxQueryExecutionTime: 1000,
      logger: new SqlFormatterLogger(),
    };

    return this.get('DBTYPE') === 'sqlite' ? dataSourceSqlite : dataSourceMysql;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.dataSourceOptions;
  }
}
