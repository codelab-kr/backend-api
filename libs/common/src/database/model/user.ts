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
  @ApiProperty({ example: 'REG_NO' })
  // @Column('enum', { enum: IdType, default: IdType.REG_NO })
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

  // @ApiProperty({ description: '생성일시' })
  @CreateDateColumn()
  createdAt: Date;

  // @ApiProperty({ description: '수정일시' })
  @UpdateDateColumn()
  updatedAt: Date;

  // @ApiProperty({ description: '삭제일시' })
  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Transfer, (transfer) => transfer.user)
  @JoinColumn({ name: 'transfers_id' }) // TODO: 확인
  transfers?: Transfer[];

  @OneToMany(() => Quote, (quota) => quota.user)
  @JoinColumn({ name: 'quotes_id' }) // TODO: 확인
  quotes?: Quote[];
}
