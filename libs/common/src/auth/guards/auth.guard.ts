import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getRequestByContext } from '../utils/get.request.by.context';
import { AuthGuard as ForJwtAuthGaurd } from '@nestjs/passport';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = getRequestByContext(context);
    return request.isAuthenticated(); // check if user is authenticated (from session)
  }
}

@Injectable()
class JwtAuthGuard extends ForJwtAuthGaurd('jwt') {
  getRequest(context: ExecutionContext): any {
    return getRequestByContext(context);
  }
}

const AuthGuard = JwtAuthGuard;
export { AuthGuard };
