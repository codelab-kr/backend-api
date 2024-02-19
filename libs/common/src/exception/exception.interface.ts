export interface IExceptionResponse {
  name: string;
  message: string;
  stack: string;
  status: number;
  statusCode: number;
  path: string;
  timestamp: string;
  data: any;
}
