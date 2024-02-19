import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { HttpService as AxiosService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class HttpService {
  private readonly logger = new Logger(HttpService.name);
  constructor(private readonly httpService: AxiosService) {}

  async get(url: string): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new Error(error.message);
        }),
      ),
    );
    return data;
  }
}
