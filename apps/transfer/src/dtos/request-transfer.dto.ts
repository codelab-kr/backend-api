import { IsEmail, IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { IdType } from '@app/common';

export class createTransferRequest {
  @IsNumberString()
  @IsNotEmpty()
  quoteId: number;

  @IsEmail()
  @IsNotEmpty()
  userId: string;

  @IsEnum(IdType)
  @IsNotEmpty()
  idType: IdType;
}
