import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as ForJwtAuthGaurd } from '@nestjs/passport';
import { getRequestByContext } from '../utils/get.request.by.context';

@Injectable()
class JwtAuthGuard extends ForJwtAuthGaurd('jwt') {
  handleRequest(err: Error, user: any, _, context: ExecutionContext) {
    if (err || !user) {
      const req = getRequestByContext(context);
      req.errorData = err;
      return false;
    }
    return user;
  }
}

const AuthGuard = JwtAuthGuard;
export { AuthGuard };
