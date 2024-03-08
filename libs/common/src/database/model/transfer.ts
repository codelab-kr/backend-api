import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IdType, Quote } from '@app/common';

@Entity({ name: 'transfer' })
export class Transfer {
  @ApiProperty({ description: '송금요청 ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'USD 송금액' })
  @Column('decimal', { precision: 20, scale: 2 })
  usdAmount: number;

  @ApiProperty({ description: '송금요청일시' })
  @CreateDateColumn()
  requestedDate: Date;

  @ApiProperty({ description: '송금요청자 ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: '송금요청자 ID 타입' })
  @Column({
    type: 'varchar',
    enum: IdType,
    default: IdType.REG_NO,
  })
  idType: IdType;

  @ApiProperty({ description: '견적서 ID' })
  @JoinColumn({ name: 'quote_id' })
  @OneToOne(() => Quote)
  quoteId: number;
}
