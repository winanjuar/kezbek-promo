import { Injectable } from '@nestjs/common';
import { CreatePromoDto } from './dto/create-promo.dto';
import { RequestPromoDto } from './dto/request-promo.dto';
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
    return this.promoConfigRepository.createNewPromo(createPromoDto);
  }

  async findAll() {
    return this.promoConfigRepository.findAll();
  }

  async findOnePromo(id: string) {
    return this.promoConfigRepository.findOnePromo(id);
  }

  async processPromo(requestPromoDto: Partial<RequestPromoDto>) {
    const quantity =
      requestPromoDto.quantity > 3 ? 3 : requestPromoDto.quantity;
    const newReqDto: Partial<RequestPromoDto> = {
      quantity: requestPromoDto.quantity > 3 ? 3 : requestPromoDto.quantity,
      act_trx: requestPromoDto.act_trx,
    };
    const promo = await this.promoConfigRepository.findRequestPromo(newReqDto);
    const promoTransaction: Partial<PromoTransaction> = {
      transaction_id: requestPromoDto.transaction_id,
      quantity_origin: requestPromoDto.quantity,
      quantity,
      act_trx: requestPromoDto.act_trx,
    };
    if (!promo) {
      promoTransaction.prosentase = 0;
      promoTransaction.point = 0;
    } else {
      promoTransaction.prosentase = promo.prosentase;
      promoTransaction.point = Math.round(
        (Number(promo.prosentase) * requestPromoDto.act_trx) / 100,
      );
    }
    const result = await this.promoTransactionRepository.createNewTransaction(
      promoTransaction,
    );
    return result;
  }
}
