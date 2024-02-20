import {
  Entity,
  Column,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Quote } from './quote';
import { Transfer } from './transfer';
import { IdType } from '../enum/idType';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

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
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'REG_NO' })
  @Column('enum', { enum: IdType, default: IdType.REG_NO })
  idType: IdType;

  @IsNotEmpty()
  @Length(13)
  @ApiProperty({ example: '1111111111111' })
  idValue: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Transfer, (transfer) => transfer.user)
  @JoinColumn()
  transfers?: Transfer[];

  @OneToMany(() => Quote, (quota) => quota.user)
  @JoinColumn()
  quotes?: Quote[];
}
