import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'transfer_settings' })
export class Transferettings {
  @PrimaryColumn()
  @ApiProperty({ description: 'id' })
  transferId: number;

  @Column({ default: false })
  commentable: boolean;

  @Column({ default: false })
  shareable: boolean;
}
