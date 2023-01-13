import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PromoConfig } from './promo-config.entity';

@Entity('promo_program')
export class PromoProgram {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code_key: string;

  @Column()
  quota: number;

  @Column({ type: 'datetime' })
  period_start: string;

  @Column({ type: 'datetime' })
  period_end: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @DeleteDateColumn()
  deleted_at: string;

  @OneToMany(() => PromoConfig, (config) => config.program)
  @JoinColumn({ name: 'program_id' })
  configs: PromoConfig[];
}
