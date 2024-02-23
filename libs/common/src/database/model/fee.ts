import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode } from '@app/common';

@Entity({ name: 'fee' })
export class Fee {
  @ApiProperty({ description: '수수료 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '받는통화코드 (ISO-4217 Currecy Code)' })
  @Column({ type: 'enum', enum: CurrencyCode })
  targetCurrency: CurrencyCode;

  @ApiProperty({ description: '건당수수료' })
  @Column('int')
  feePerCase: number;

  @ApiProperty({ description: '수수료율' })
  @Column('decimal', { precision: 5, scale: 4 })
  feeRate: number;

  @ApiProperty({ description: '적용시작' })
  @Column('int')
  amountFrom: number;

  @ApiProperty({ description: '적용종료' })
  @Column('int', { nullable: true })
  amountTo?: number;

  @ApiProperty({ description: '적용시작일시' })
  @Column('date')
  validFrom: Date;

  @ApiProperty({ description: '적용종료일시' })
  @Column('date', { nullable: true })
  validTo?: Date;

  @ApiProperty({ description: '적용여부' })
  @Column('boolean', { default: true })
  isValid: boolean;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  @UpdateDateColumn()
  updatedAt?: Date;

  @ApiProperty({ description: '삭제일시' })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
