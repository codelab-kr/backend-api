import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateTransferInput {
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  userId?: number;
}
