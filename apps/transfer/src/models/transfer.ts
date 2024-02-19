import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Transferettings } from './transfer.settings';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'transfer' })
export class Transfer {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  content?: string;

  @Column()
  userId: number;

  @OneToOne(() => Transferettings)
  @JoinColumn()
  settings?: Transferettings;
}
