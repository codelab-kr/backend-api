import { HttpStatus } from '@nestjs/common';

export function result(status: HttpStatus, message: string, data?: any) {
  return {
    resultCode: `${status} (HttpStatus.${HttpStatus[status]})`,
    resultMsg: message,
    ...(data ?? {}),
  };
}
