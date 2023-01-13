import { Injectable } from '@nestjs/common';
import { PromoTransaction } from 'src/entity/promo-transaction.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PromoTransactionRepository extends Repository<PromoTransaction> {
  constructor(private readonly dataSource: DataSource) {
    super(PromoTransaction, dataSource.createEntityManager());
  }

  async createNewTransaction(transactionData: Partial<PromoTransaction>) {
    return await this.save(transactionData);
  }

  async getTotal(promo_code: string) {
    return await this.count({ where: { promo_code } });
  }
}
