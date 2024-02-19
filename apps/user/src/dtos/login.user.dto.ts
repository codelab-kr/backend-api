import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
