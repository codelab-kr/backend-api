import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode, IdType } from '@app/common';

@Entity({ name: 'quote' })
export class Quote {
  @ApiProperty({ description: '견적서 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '원화 송금 요청액' })
  @Column('int')
  sourceAmount: number;

  @ApiProperty({ description: '송금 수수료' })
  @Column('int')
  fee: number;

  @ApiProperty({ description: 'USD 환율' })
  @Column('decimal', { precision: 10, scale: 2 })
  usdExchangeRate: number;

  @ApiProperty({ description: 'USD 송금액' })
  @Column('decimal', { precision: 20, scale: 2 })
  usdAmount: number;

  @ApiProperty({ description: '받는통화코드 (ISO-4217 Currecy Code)' })
  // @Column({ type: 'enum', enum: CurrencyCode }) // for mysql
  @Column({
    type: 'varchar',
    enum: CurrencyCode,
    default: CurrencyCode.USD,
  })
  targetCurrency: CurrencyCode;

  @ApiProperty({ description: '받는 통화 금액' })
  @Column('decimal', { precision: 20, scale: 2 })
  targetAmount: number;

  @ApiProperty({ description: '받는 통화 환율' })
  @Column('decimal', { precision: 10, scale: 2 })
  exchangeRate: number;

  @ApiProperty({ description: '견적서 생성일시' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '견적서 만료일시' })
  @Column()
  expireTime: Date;

  @ApiProperty({ description: '견적서 생성자 ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: '견적서 생성자 ID 타입' })
  @Column({
    type: 'varchar',
    enum: IdType,
    default: IdType.REG_NO,
  })
  idType: IdType;
}
