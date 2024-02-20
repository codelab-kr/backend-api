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
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '송금요청 ID' })
  id: number;

  @Column('decimal', { precision: 20, scale: 2 })
  @ApiProperty({ description: 'USD 송금액' })
  usdAmount: number;

  // @Column('decimal', { precision: 20, scale: 2 })
  // @ApiProperty({ description: '받는 통화 금액' })
  // targetAmount: number;

  @CreateDateColumn()
  @ApiProperty({ description: '송금요청일시' })
  createdAt: Date;

  // @Column('enum', { enum: ['REQUEST', '', 'USD'] })
  // @ApiProperty({ description: '송금응답코드' })
  // status: number;

  // @UpdateDateColumn()
  // @ApiProperty({ description: '송금내역 업데이트 일시' })
  // updatedAt?: Date;

  @OneToOne(() => Quote)
  @JoinColumn()
  quote: Quote;

  @ManyToOne(() => User, (user) => user.transfers)
  user: User;
}
