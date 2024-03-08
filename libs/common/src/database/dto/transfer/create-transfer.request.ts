import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferRequest {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  quoteId: number;
}
