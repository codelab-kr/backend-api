import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  // UpdateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Quote } from './quote';
import { User } from './user';

@Entity({ name: 'transfer' })
export class Transfer {
  @ApiProperty({ description: '송금요청 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'USD 송금액' })
  @Column('decimal', { precision: 20, scale: 2 })
  usdAmount: number;

  // @ApiProperty({ description: '받는 통화 금액' })
  // @Column('decimal', { precision: 20, scale: 2 })
  // targetAmount: number;

  @ApiProperty({ description: '송금요청일시' })
  @CreateDateColumn()
  createdAt: Date;

  // @ApiProperty({ description: '송금응답코드' })
  // @Column('enum', { enum: ['REQUEST', '', 'USD'] })
  // status: number;

  // @ApiProperty({ description: '송금내역 업데이트 일시' })
  // @UpdateDateColumn()
  // updatedAt?: Date;

  @OneToOne(() => Quote)
  @JoinColumn({ name: 'quote_id' }) // TODO: 확인
  quote: Quote;

  @ManyToOne(() => User, (user) => user.transfers)
  @JoinColumn({ name: 'user_id' }) // TODO: 확인
  user: User;
}
