import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@test.com' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'abcd1234' })
  password: string;
}
