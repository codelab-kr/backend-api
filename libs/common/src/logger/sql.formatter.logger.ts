/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as sqlFormatter from 'sql-formatter';

@Injectable()
export class SqlFormatterLogger implements Logger {
  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner,
  ): any {
    console.log(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    console.log(message);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    console.log(sqlFormatter.format(query));
    if (parameters) {
      console.log(`Parameters: ${JSON.stringify(parameters)}`);
    }
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    console.error('Query failed:', query, parameters);
    console.error('Error:', error);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    console.warn('Query is slow:', query, parameters);
    console.warn('Execution time:', time);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    console.log(message);
  }
}
