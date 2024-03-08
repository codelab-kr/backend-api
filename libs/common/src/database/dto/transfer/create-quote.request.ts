import { IsEnum, IsNotEmpty, IsNumberString, IsUUID } from 'class-validator';
import { CurrencyCode, IdType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuoteRequest {
  @IsEnum(CurrencyCode)
  @IsNotEmpty()
  @ApiProperty({ type: CurrencyCode, example: 'USD' })
  targetCurrency: CurrencyCode;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ example: 100000 })
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '960f06ee-d26a-47df-aa1f-c98dc720546f' })
  userId: string;

  @IsNotEmpty()
  @IsEnum(IdType)
  @ApiProperty({ example: IdType.REG_NO })
  idType: IdType;
}
