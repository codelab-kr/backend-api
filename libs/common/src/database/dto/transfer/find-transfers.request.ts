import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindTransfersRequest {
  @IsNotEmpty()
  @IsEmail()
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  date?: Date;
}
