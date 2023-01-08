import { Injectable } from '@nestjs/common';
import { PromoConstanta } from 'src/core/promo.constanta';
import { CreatePromoDto } from 'src/dto/create-promo.dto';
import { RequestPromoDto } from 'src/dto/request-promo.dto';
import { PromoConfig } from 'src/entity/promo-config.entity';
import {
  DataSource,
  IsNull,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm';

@Injectable()
export class PromoConfigRepository extends Repository<PromoConfig> {
  constructor(private readonly dataSource: DataSource) {
    super(PromoConfig, dataSource.createEntityManager());
  }

  async createNewPromo(createPromoDto: CreatePromoDto) {
    return await this.save(createPromoDto);
  }

  async findAll(): Promise<PromoConfig[]> {
    return this.find();
  }

  async findOnePromo(id: string) {
    return this.findOneBy({ id });
  }

  async findRequestPromo(
    requestPromoDto: Partial<RequestPromoDto>,
  ): Promise<PromoConfig> {
    if (requestPromoDto.act_trx < PromoConstanta.MAX_TRX) {
      return this.findOne({
        where: {
          quantity: requestPromoDto.quantity,
          min_trx: LessThanOrEqual(requestPromoDto.act_trx),
          max_trx: MoreThan(requestPromoDto.act_trx),
        },
      });
    } else {
      return this.findOne({
        where: {
          quantity: requestPromoDto.quantity,
          min_trx: LessThanOrEqual(requestPromoDto.act_trx),
          max_trx: IsNull(),
        },
      });
    }
  }
}
