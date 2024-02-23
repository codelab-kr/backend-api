import { ExecutionContext, Injectable } from '@nestjs/common';
import { getRequestByContext } from '../utils/get.request.by.context';
import { AuthGuard as ForJwtAuthGaurd } from '@nestjs/passport';

@Injectable()
class JwtAuthGuard extends ForJwtAuthGaurd('jwt') {
  getRequest(context: ExecutionContext): any {
    return getRequestByContext(context);
  }
}

const AuthGuard = JwtAuthGuard;
export { AuthGuard };
