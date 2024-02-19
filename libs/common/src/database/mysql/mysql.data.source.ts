import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from './mysql.service';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// only for migration
export const dataSource: DataSource = new DataSource({
  ...new TypeOrmConfigService(
    new ConfigService(
      dotenv.config({
        path: path.resolve('.env'),
      }).parsed,
    ),
  ).dataSourceOptions,
  entities: ['apps/**/models/*.ts'],
  migrationsTableName: 'migrations',
  migrations: ['databases/mysql/*.ts'],
});
