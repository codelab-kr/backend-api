import { ExecutionContext } from '@nestjs/common';

export const getRequestByContext = (context: ExecutionContext): any => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest();
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData();
  }
  if (context.getType() === 'ws') {
    return context.switchToWs().getData();
  }
};
