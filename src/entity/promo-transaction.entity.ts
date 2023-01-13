import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('promo_transaction')
export class PromoTransaction {
  @PrimaryColumn('uuid')
  transaction_id: string;

  @Column({ type: 'datetime' })
  transaction_time: string;

  @Index()
  @Column('uuid')
  customer_id: string;

  @Column()
  promo_code: string;

  @Column()
  quantity_origin: number;

  @Column()
  quantity: number;

  @Column()
  act_trx: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  prosentase: number;

  @Column()
  point: number;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
