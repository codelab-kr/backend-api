import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'bb5d4732-e76e-4acf-ab5c-d45db6598c1f' })
  id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'abcd1234' })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'test' })
  username?: string;

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
