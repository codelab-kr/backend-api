import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  username?: string;

  @IsOptional()
  isSubscribed?: boolean;

  @IsOptional()
  photo?: string;

  @IsOptional()
  paymentId?: string;
}
