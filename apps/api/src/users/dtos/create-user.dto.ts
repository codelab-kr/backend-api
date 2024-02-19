import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'abcd1234' })
  password?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @ApiProperty({ example: 'test' })
  username: string;

  @IsOptional()
  @ApiProperty({ example: true })
  isSubscribed?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '102121788398419656772' })
  providerId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a-/AOh14GjKQG9vq1X0w6ZvP8e8vX4Z9v2l9iJXOZtQXw7D=s96-c',
  })
  photo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: null })
  paymentId?: string;
}
