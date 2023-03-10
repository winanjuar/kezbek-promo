import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PromoProgram } from './promo-program.entity';

@Entity('promo_config')
export class PromoConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @ManyToOne(() => PromoProgram, (program) => program.id)
  @JoinColumn({ name: 'program_id' })
  program: PromoProgram;
}
