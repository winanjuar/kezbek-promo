import { Injectable } from '@nestjs/common';
import { PromoConstanta } from './core/promo.constanta';
import { IRequestInfoPromo } from './core/request-info-promo.interface';
import { IResponseInfoPromo } from './core/response-info-promo.interface';
import { CreatePromoDto } from './dto/create-promo.dto';
import { PromoTransaction } from './entity/promo-transaction.entity';
import { PromoConfigRepository } from './repository/promo-config.repository';
import { PromoTransactionRepository } from './repository/promo-transaction.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly promoConfigRepository: PromoConfigRepository,
    private readonly promoTransactionRepository: PromoTransactionRepository,
  ) {}

  async create(createPromoDto: CreatePromoDto) {
    return await this.promoConfigRepository.createNewPromo(createPromoDto);
  }

  async findAll() {
    return await this.promoConfigRepository.findAll();
  }

  async findOnePromo(id: string) {
    return await this.promoConfigRepository.findOnePromo(id);
  }

  async processPromo(
    dataReqPromo: IRequestInfoPromo,
  ): Promise<IResponseInfoPromo> {
    const quantity =
      dataReqPromo.quantity > PromoConstanta.MAX_QUANTITY
        ? PromoConstanta.MAX_QUANTITY
        : dataReqPromo.quantity;

    const newReqDto: Partial<IRequestInfoPromo> = {
      quantity,
      act_trx: dataReqPromo.act_trx,
    };
    const promo = await this.promoConfigRepository.findRequestPromo(newReqDto);
    const promoTransaction: Partial<PromoTransaction> = {
      transaction_id: dataReqPromo.transaction_id,
      quantity_origin: dataReqPromo.quantity,
      quantity,
      act_trx: dataReqPromo.act_trx,
    };
    if (!promo) {
      promoTransaction.prosentase = 0;
      promoTransaction.point = 0;
    } else {
      promoTransaction.prosentase = promo.prosentase;
      promoTransaction.point = Math.round(
        (Number(promo.prosentase) * dataReqPromo.act_trx) / 100,
      );
    }
    const result = await this.promoTransactionRepository.createNewTransaction(
      promoTransaction,
    );

    return {
      prosentase: result.prosentase,
      point: result.point,
    } as IResponseInfoPromo;
  }
}
