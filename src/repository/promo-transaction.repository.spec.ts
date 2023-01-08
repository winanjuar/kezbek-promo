import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PromoTransactionRepository } from './promo-transaction.repository';
import { PromoTransaction } from 'src/entity/promo-transaction.entity';

describe('PromoTransactionRepository', () => {
  let promoTransactionRepository: PromoTransactionRepository;
  let mockPromoTransaction: PromoTransaction;
  let transactionDto: Partial<PromoTransaction>;

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

    transactionDto = {
      transaction_id: faker.datatype.uuid(),
      quantity_origin: faker.datatype.number(),
      quantity: faker.datatype.number(),
      act_trx: faker.datatype.number(),
    };

    mockPromoTransaction = {
      transaction_id: transactionDto.transaction_id,
      quantity_origin: transactionDto.quantity,
      quantity: transactionDto.quantity,
      act_trx: transactionDto.act_trx,
      prosentase: faker.datatype.number(),
      point: faker.datatype.number(),
      created_at: '2023-01-08T05:41:47.908Z',
      updated_at: '2023-01-08T05:41:47.908Z',
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('createNewTransaction', () => {
    it('should return promo config', async () => {
      // arrange
      const spySave = jest
        .spyOn(promoTransactionRepository, 'save')
        .mockResolvedValue(mockPromoTransaction);

      // act
      const promoTransaction =
        await promoTransactionRepository.createNewTransaction(transactionDto);

      // assert
      expect(promoTransaction).toEqual(mockPromoTransaction);
      expect(spySave).toHaveBeenCalledTimes(1);
      expect(spySave).toHaveBeenCalledWith(transactionDto);
    });
  });
});
