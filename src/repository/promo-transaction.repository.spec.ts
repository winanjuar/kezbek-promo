import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PromoTransactionRepository } from './promo-transaction.repository';
import { PromoTransaction } from 'src/entity/promo-transaction.entity';

describe('PromoTransactionRepository', () => {
  let promoTransactionRepository: PromoTransactionRepository;
  let mockPromoTransaction: PromoTransaction;
  let transactionData: Partial<PromoTransaction>;

  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromoTransactionRepository,
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    promoTransactionRepository = module.get<PromoTransactionRepository>(
      PromoTransactionRepository,
    );

    transactionData = {
      transaction_id: faker.datatype.uuid(),
      transaction_time: '2023-01-05T20:51:39.999Z',
      customer_id: faker.datatype.uuid(),
      promo_code: faker.datatype.string(),
      quantity_origin: faker.datatype.number(),
      quantity: faker.datatype.number(),
      act_trx: faker.datatype.number(),
    };

    mockPromoTransaction = {
      transaction_id: transactionData.transaction_id,
      transaction_time: transactionData.transaction_time,
      customer_id: transactionData.customer_id,
      promo_code: transactionData.promo_code,
      quantity_origin: transactionData.quantity,
      quantity: transactionData.quantity,
      act_trx: transactionData.act_trx,
      prosentase: faker.datatype.number(),
      point: faker.datatype.number(),
      created_at: '2023-01-08T05:41:47.908Z',
      updated_at: '2023-01-08T05:41:47.908Z',
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('createNewTransaction', () => {
    it('should return new transaction', async () => {
      // arrange
      const spySave = jest
        .spyOn(promoTransactionRepository, 'save')
        .mockResolvedValue(mockPromoTransaction);

      // act
      const promoTransaction =
        await promoTransactionRepository.createNewTransaction(transactionData);

      // assert
      expect(promoTransaction).toEqual(mockPromoTransaction);
      expect(spySave).toHaveBeenCalledTimes(1);
      expect(spySave).toHaveBeenCalledWith(transactionData);
    });
  });

  describe('getTotal', () => {
    it('should return new transaction', async () => {
      // arrange
      const code = transactionData.promo_code;
      const totalData = faker.datatype.number();
      const spyCount = jest
        .spyOn(promoTransactionRepository, 'count')
        .mockResolvedValue(totalData);

      // act
      const total = await promoTransactionRepository.getTotal(code);

      // assert
      expect(total).toEqual(totalData);
      expect(spyCount).toHaveBeenCalledTimes(1);
      expect(spyCount).toHaveBeenCalledWith({ where: { promo_code: code } });
    });
  });
});
