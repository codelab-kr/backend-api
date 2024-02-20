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
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '수수료 ID' })
  id: number;

  @Column({ type: 'enum', enum: CurrencyCode })
  @ApiProperty({ description: '받는통화코드 (ISO-4217 Currecy Code)' })
  targetCurrency: CurrencyCode;

  @Column('int')
  @ApiProperty({ description: '건당수수료' })
  feePerCase: number;

  @Column('decimal', { precision: 5, scale: 4 })
  @ApiProperty({ description: '수수료율' })
  feeRate: number;

  @Column('int')
  @ApiProperty({ description: '적용시작' })
  amountFrom: number;

  @Column('int', { nullable: true })
  @ApiProperty({ description: '적용종료' })
  amountTo?: number;

  @Column('date')
  @ApiProperty({ description: '적용시작일시' })
  validFrom: Date;

  @Column('date', { nullable: true })
  @ApiProperty({ description: '적용종료일시' })
  validTo?: Date;

  @Column('boolean', { default: true })
  @ApiProperty({ description: '적용여부' })
  isValid: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '수정일시' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty({ description: '수정일시' })
  deletedAt?: Date;
}
