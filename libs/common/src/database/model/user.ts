import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Quote } from './quote';
import { Transfer } from './transfer';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  isSubscribed?: boolean;

  @Column({ nullable: true })
  providerId?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  paymentId?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Transfer, (transfer) => transfer.user)
  @JoinColumn()
  transfers?: Transfer[];

  @OneToMany(() => Quote, (quota) => quota.user)
  @JoinColumn()
  quotes?: Quote[];
}
