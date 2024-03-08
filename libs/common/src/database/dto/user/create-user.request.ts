import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';
import { IdType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IdValueLength } from '../../../decorator/idValueLength';

export class CreateUserRequest {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'abcd1234' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ example: IdType.REG_NO })
  // @Column('enum', { enum: IdType, default: IdType.REG_NO }) // for mysql
  @IsEnum(IdType)
  idType: IdType;

  @IsNotEmpty()
  @IdValueLength('idType')
  @IsNumberString()
  @ApiProperty({ example: '1111111111111' })
  idValue: string;
}
