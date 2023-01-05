import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('promo_config')
export class PromoConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  promo_code: string;

  @Column({ nullable: true })
  promo_quota: string;

  @Column({ nullable: true })
  promo_period_start: Date;

  @Column({ nullable: true })
  promo_period_end: Date;

  @Column()
  quantity: number;

  @Column()
  min_trx: number;

  @Column({ nullable: true })
  max_trx: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  prosentase: number;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @DeleteDateColumn()
  deleted_at: string;
}
