import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { omit } from 'lodash';

import { AppService } from './app.service';
import { PromoConstanta } from './core/promo.constanta';
import { IRequestInfoPromo } from './core/request-info-promo.interface';
import { IResponseInfoPromo } from './core/response-info-promo.interface';
import { CreatePromoDto } from './dto/create-promo.dto';
import { PromoConfig } from './entity/promo-config.entity';
import { PromoTransaction } from './entity/promo-transaction.entity';
import { PromoConfigRepository } from './repository/promo-config.repository';
import { PromoTransactionRepository } from './repository/promo-transaction.repository';

describe('AppService', () => {
  let appService: AppService;
  let mockPromoConfig: PromoConfig;
  let mockPromoTransaction: Partial<PromoTransaction>;

  const promoConfigRepository = {
    createNewPromo: jest.fn(),
    findAll: jest.fn(),
    findOnePromo: jest.fn(),
    findRequestPromo: jest.fn(),
  };

  const promoTransactionRepository = {
    createNewTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: PromoConfigRepository, useValue: promoConfigRepository },
        {
          provide: PromoTransactionRepository,
          useValue: promoTransactionRepository,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);

    mockPromoConfig = {
      id: faker.datatype.uuid(),
      promo_code: faker.datatype.string(),
      promo_quota: faker.datatype.number(),
      promo_period_start: new Date(),
      promo_period_end: new Date(),
      quantity: faker.datatype.number(),
      min_trx: faker.datatype.number(),
      max_trx: faker.datatype.number(),
      prosentase: faker.datatype.float(),
      created_at: '2023-01-01T05:26:21.766Z',
      updated_at: '2023-01-01T05:26:21.766Z',
      deleted_at: null,
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should return new promo config just created', async () => {
      // arrange
      const createPromoDto: CreatePromoDto = omit(mockPromoConfig, [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
      ]);
      const spyCreateNewPromoConfig = jest
        .spyOn(promoConfigRepository, 'createNewPromo')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await appService.create(createPromoDto);

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spyCreateNewPromoConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateNewPromoConfig).toHaveBeenCalledWith(createPromoDto);
    });
  });

  describe('findAll', () => {
    it('should return all promo config in db', async () => {
      // arrange
      const spyFindAll = jest
        .spyOn(promoConfigRepository, 'findAll')
        .mockResolvedValue([mockPromoConfig]);

      // act
      const promoConfigs = await appService.findAll();

      // assert
      expect(promoConfigs).toEqual([mockPromoConfig]);
      expect(spyFindAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOnePromo', () => {
    it('should return promo config based on id', async () => {
      // arrange
      const id = mockPromoConfig.id;

      const spyFindOnePromo = jest
        .spyOn(promoConfigRepository, 'findOnePromo')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfigs = await appService.findOnePromo(id);

      // assert
      expect(promoConfigs).toEqual(mockPromoConfig);
      expect(spyFindOnePromo).toHaveBeenCalledTimes(1);
      expect(spyFindOnePromo).toHaveBeenCalledWith(id);
    });
  });

  describe('processPromo', () => {
    it('should process promo and return point promo transaction', async () => {
      // arrange
      const dataReqPromo: IRequestInfoPromo = {
        transaction_id: faker.datatype.uuid(),
        quantity: 4,
        act_trx: faker.datatype.number(),
        promo_code: faker.datatype.string(),
      };

      const prosentase = 1.2;

      mockPromoConfig = {
        id: dataReqPromo.transaction_id,
        promo_code: dataReqPromo.promo_code,
        promo_quota: faker.datatype.number(),
        promo_period_start: new Date(),
        promo_period_end: new Date(),
        quantity: PromoConstanta.MAX_QUANTITY,
        min_trx: dataReqPromo.act_trx - 1000,
        max_trx: dataReqPromo.act_trx + 1000,
        prosentase,
        created_at: '2023-01-01T05:26:21.766Z',
        updated_at: '2023-01-01T05:26:21.766Z',
        deleted_at: null,
      };

      const point = (prosentase * dataReqPromo.act_trx) / 100;

      const mockInfoPromo: IResponseInfoPromo = {
        prosentase,
        point,
      };

      mockPromoTransaction = {
        transaction_id: dataReqPromo.transaction_id,
        quantity_origin: dataReqPromo.quantity,
        quantity: PromoConstanta.MAX_QUANTITY,
        act_trx: dataReqPromo.act_trx,
        prosentase,
        point,
        created_at: '2023-01-08T05:41:47.908Z',
        updated_at: '2023-01-08T05:41:47.908Z',
      };

      const spyFindRequestPromo = jest
        .spyOn(promoConfigRepository, 'findRequestPromo')
        .mockResolvedValue(mockPromoConfig);

      const spyCreateNewTransaction = jest
        .spyOn(promoTransactionRepository, 'createNewTransaction')
        .mockResolvedValue(mockPromoTransaction);

      // act
      const pointTransaction = await appService.processPromo(dataReqPromo);

      // assert
      expect(pointTransaction).toEqual(mockInfoPromo);
      expect(spyFindRequestPromo).toHaveBeenCalledTimes(1);
      expect(spyCreateNewTransaction).toHaveBeenCalledTimes(1);
    });

    it('should process promo and return point promo transaction without exceed max quantity', async () => {
      // arrange
      const dataReqPromo: IRequestInfoPromo = {
        transaction_id: faker.datatype.uuid(),
        quantity: 3,
        act_trx: faker.datatype.number(),
        promo_code: faker.datatype.string(),
      };

      const prosentase = 1.2;

      mockPromoConfig = {
        id: dataReqPromo.transaction_id,
        promo_code: dataReqPromo.promo_code,
        promo_quota: faker.datatype.number(),
        promo_period_start: new Date(),
        promo_period_end: new Date(),
        quantity: PromoConstanta.MAX_QUANTITY,
        min_trx: dataReqPromo.act_trx - 1000,
        max_trx: dataReqPromo.act_trx + 1000,
        prosentase,
        created_at: '2023-01-01T05:26:21.766Z',
        updated_at: '2023-01-01T05:26:21.766Z',
        deleted_at: null,
      };

      const point = (prosentase * dataReqPromo.act_trx) / 100;

      const mockInfoPromo: IResponseInfoPromo = {
        prosentase,
        point,
      };

      mockPromoTransaction = {
        transaction_id: dataReqPromo.transaction_id,
        quantity_origin: dataReqPromo.quantity,
        quantity: PromoConstanta.MAX_QUANTITY,
        act_trx: dataReqPromo.act_trx,
        prosentase,
        point,
        created_at: '2023-01-08T05:41:47.908Z',
        updated_at: '2023-01-08T05:41:47.908Z',
      };

      const spyFindRequestPromo = jest
        .spyOn(promoConfigRepository, 'findRequestPromo')
        .mockResolvedValue(mockPromoConfig);

      const spyCreateNewTransaction = jest
        .spyOn(promoTransactionRepository, 'createNewTransaction')
        .mockResolvedValue(mockPromoTransaction);

      // act
      const pointTransaction = await appService.processPromo(dataReqPromo);

      // assert
      expect(pointTransaction).toEqual(mockInfoPromo);
      expect(spyFindRequestPromo).toHaveBeenCalledTimes(1);
      expect(spyCreateNewTransaction).toHaveBeenCalledTimes(1);
    });

    it('should process promo and return 0 point promo transaction', async () => {
      // arrange
      const dataReqPromo: IRequestInfoPromo = {
        transaction_id: faker.datatype.uuid(),
        quantity: 4,
        act_trx: faker.datatype.number(),
        promo_code: faker.datatype.string(),
      };

      const prosentase = 0;
      const point = 0;

      const mockInfoPromo: IResponseInfoPromo = {
        prosentase,
        point,
      };

      mockPromoTransaction = {
        transaction_id: dataReqPromo.transaction_id,
        quantity_origin: dataReqPromo.quantity,
        quantity: PromoConstanta.MAX_QUANTITY,
        act_trx: dataReqPromo.act_trx,
        prosentase,
        point,
        created_at: '2023-01-08T05:41:47.908Z',
        updated_at: '2023-01-08T05:41:47.908Z',
      };

      const spyFindRequestPromo = jest
        .spyOn(promoConfigRepository, 'findRequestPromo')
        .mockResolvedValue(null);

      const spyCreateNewTransaction = jest
        .spyOn(promoTransactionRepository, 'createNewTransaction')
        .mockResolvedValue(mockPromoTransaction);

      // act
      const pointTransaction = await appService.processPromo(dataReqPromo);

      // assert
      expect(pointTransaction).toEqual(mockInfoPromo);
      expect(spyFindRequestPromo).toHaveBeenCalledTimes(1);
      expect(spyCreateNewTransaction).toHaveBeenCalledTimes(1);
    });
  });
});
