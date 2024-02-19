import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @ApiProperty({ example: 'abcd1234' })
  password?: string;

  @ApiProperty({ example: 'test' })
  username: string;

  @ApiProperty({ example: true })
  isSubscribed?: boolean;

  @ApiProperty({ example: 'google-oauth2|1234567890' })
  providerId?: string;

  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a-/AOh14GjKQG9vq1X0w6ZvP8e8vX4Z9v2l9iJXOZtQXw7D=s96-c',
  })
  photo?: string;

  @ApiProperty({ example: 'paymentId' })
  paymentId?: string;
}
