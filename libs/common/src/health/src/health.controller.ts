import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { EmailService } from '@app/common';

@Controller('')
@ApiTags('')
export class HealthController {
  constructor(
    private readonly appService: HealthService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private email: EmailService,
  ) {}

  @Get('/health')
  @ApiOperation({ description: 'health check' })
  healthCheck(@Res() res: Response) {
    const result: string = this.appService.sendOk();

    return res.status(HttpStatus.OK).send(result);
  }

  @Get()
  // @Get('/health')
  @ApiOperation({ description: 'health check' })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('api-docs', 'http://localhost:3000/api-docs'),
      () => this.db.pingCheck('database'),
      () => this.email.pingCheck('email'),
    ]);
  }
}
