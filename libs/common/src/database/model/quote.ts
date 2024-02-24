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
  // @Column({ type: 'enum', enum: CurrencyCode })
  @Column({
    type: 'varchar',
    enum: CurrencyCode,
    default: CurrencyCode.KRW,
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

  // @ApiProperty({ description: '견적서 만료일시' })
  // @Column({ type: 'timestamp', nullable: true })
  // expireTime: Date;

  @ManyToOne(() => User, (user) => user.quotes)
  @JoinColumn({ name: 'user_id' }) // TODO: 확인
  user: User;

  @OneToOne(() => Transfer)
  @JoinColumn({ name: 'transfer_id' }) // TODO: 확인
  transfer?: Transfer;
}
