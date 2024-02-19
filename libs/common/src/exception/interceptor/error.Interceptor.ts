import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return (
      next
        .handle()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .pipe(catchError((err) => throwError(() => new Error(err))))
    );
  }
}
