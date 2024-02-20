import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode, Transfer } from '@app/common';
import { User } from './user';

@Entity({ name: 'quote' })
export class Quote {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '견적서 ID' })
  id: number;

  @Column('int', { name: 'source_amount' })
  @ApiProperty({ description: '원화 송금 요청액' })
  sourceAmount: number;

  @Column('int')
  @ApiProperty({ description: '송금 수수료' })
  fee: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty({ description: 'USD 환율' })
  usdExchangeRate: number;

  @Column('decimal', { precision: 20, scale: 2 })
  @ApiProperty({ description: 'USD 송금액' })
  usdAmount: number;

  @Column({ type: 'enum', enum: CurrencyCode })
  @ApiProperty({ description: '받는통화코드 (ISO-4217 Currecy Code)' })
  targetCurrency: CurrencyCode;

  @Column('decimal', { precision: 20, scale: 2 })
  @ApiProperty({ description: '받는 통화 금액' })
  targetAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty({ description: '받는 통화 환율' })
  exchangeRate: number;

  @CreateDateColumn()
  @ApiProperty({ description: '견적서 생성일시' })
  createdAt: Date;

  // @Column({ type: 'timestamp', nullable: true })
  // @ApiProperty({ description: '견적서 만료일시' })
  // expireTime: Date;

  @ManyToOne(() => User, (user) => user.quotes)
  user: User;

  @OneToOne(() => Transfer)
  @JoinColumn()
  transfer?: Transfer;
}
