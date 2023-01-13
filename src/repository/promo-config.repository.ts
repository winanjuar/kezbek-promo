import { Injectable } from '@nestjs/common';
import { PromoConstanta } from 'src/core/promo.constanta';
import { EligibleConfigDto } from 'src/dto/request/config/eligible-config.dto';
import { PromoConfig } from 'src/entity/promo-config.entity';
import {
  DataSource,
  IsNull,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

@Injectable()
export class PromoConfigRepository extends Repository<PromoConfig> {
  constructor(private readonly dataSource: DataSource) {
    super(PromoConfig, dataSource.createEntityManager());
  }

  async createNewConfig(configData: Partial<PromoConfig>) {
    return await this.save(configData);
  }

  async findAllConfig(): Promise<PromoConfig[]> {
    return this.find({ relations: ['program'] });
  }

  async findOneConfig(id: string) {
    return this.findOne({ relations: ['program'], where: { id } });
  }

  async findEligibleConfig(eligibleDto: EligibleConfigDto) {
    const defaultCondition = {
      quantity: eligibleDto.quantity,
      min_trx: LessThanOrEqual(eligibleDto.act_trx),
      program: {
        code_key: eligibleDto.promo_code,
        period_start: LessThanOrEqual(eligibleDto.transaction_time),
        period_end: MoreThanOrEqual(eligibleDto.transaction_time),
      },
    };
    if (eligibleDto.act_trx < PromoConstanta.MAX_TRX) {
      return this.findOne({
        relations: ['program'],
        where: {
          ...defaultCondition,
          max_trx: MoreThan(eligibleDto.act_trx),
        },
      });
    } else {
      return this.findOne({
        relations: ['program'],
        where: {
          ...defaultCondition,
          max_trx: IsNull(),
        },
      });
    }
  }
}
