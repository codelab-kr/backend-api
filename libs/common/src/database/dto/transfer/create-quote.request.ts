import { IsEmail, IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
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

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@test.com' })
  userId: string;

  @IsNotEmpty()
  @IsEnum(IdType)
  @ApiProperty({ example: IdType.REG_NO })
  idType: IdType;
}
