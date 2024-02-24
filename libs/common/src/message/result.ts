import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Message } from './message';

export function result(
  res: Response,
  status: HttpStatus,
  message: string,
  data?: any,
) {
  if (status?.toString() === 'error' || status === 500 || !status) {
    status = HttpStatus.INTERNAL_SERVER_ERROR;
    message = Message.UNKNOWN_ERROR;
  }
  return res.status(status).json({
    resultCode: `${status} (HttpStatus.${HttpStatus[status]})`,
    resultMsg: message,
    ...(data ?? {}),
  });
}
