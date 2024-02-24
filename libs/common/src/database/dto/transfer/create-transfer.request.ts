import { IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferRequest {
  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  quoteId: string;
}
