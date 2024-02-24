import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { IdType } from '../enum/idType';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { IdValueLength } from '../../decorator/idValueLength';

@Entity({ name: 'user' })
export class User {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'test@test.com' })
  @PrimaryColumn()
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'abcd1234' })
  @Column()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test' })
  @Column()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ example: IdType.REG_NO })
  // @Column('enum', { enum: IdType, default: IdType.REG_NO }) // for mysql
  @Column({
    type: 'varchar',
    enum: IdType,
    default: IdType.REG_NO,
  })
  idType: IdType;

  @IsNotEmpty()
  @IdValueLength('idType')
  @IsNumberString()
  @ApiProperty({ example: '1111111111111' })
  @Column()
  idValue: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
