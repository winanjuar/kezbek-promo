import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, IsNull, LessThanOrEqual, MoreThan } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PromoConfigRepository } from './promo-config.repository';
import { PromoConfig } from 'src/entity/promo-config.entity';
import { CreatePromoDto } from 'src/dto/create-promo.dto';
import { IRequestInfoPromo } from 'src/core/request-info-promo.interface';

describe('PromoConfigRepository', () => {
  let promoConfigRepository: PromoConfigRepository;
  let mockPromoConfig: PromoConfig;
  let promoDto: CreatePromoDto;
  let requestPromoDto: Partial<IRequestInfoPromo>;

  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromoConfigRepository,
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    promoConfigRepository = module.get<PromoConfigRepository>(
      PromoConfigRepository,
    );

    promoDto = {
      quantity: faker.datatype.number(),
      min_trx: faker.datatype.number(),
      max_trx: faker.datatype.number(),
      prosentase: faker.datatype.float(),
      promo_code: faker.datatype.string(),
      promo_quota: faker.datatype.number(),
      promo_period_start: new Date(),
      promo_period_end: new Date(),
    };

    mockPromoConfig = {
      ...promoDto,
      id: faker.datatype.uuid(),
      promo_code: faker.datatype.string(),
      promo_quota: faker.datatype.number(),
      promo_period_start: new Date(),
      promo_period_end: new Date(),
      created_at: '2023-01-08T05:41:47.908Z',
      updated_at: '2023-01-08T05:41:47.908Z',
      deleted_at: null,
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('createNewPromo', () => {
    it('should return promo config', async () => {
      // arrange
      const spySave = jest
        .spyOn(promoConfigRepository, 'save')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await promoConfigRepository.createNewPromo(promoDto);

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spySave).toHaveBeenCalledTimes(1);
      expect(spySave).toHaveBeenCalledWith(promoDto);
    });
  });

  describe('findAll', () => {
    it('should return all promo config', async () => {
      // arrange
      const spyFind = jest
        .spyOn(promoConfigRepository, 'find')
        .mockResolvedValue([mockPromoConfig]);

      // act
      const promoConfigs = await promoConfigRepository.findAll();

      // assert
      expect(promoConfigs).toEqual([mockPromoConfig]);
      expect(spyFind).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOnePromo', () => {
    it('should return all promo config', async () => {
      // arrange
      const id = mockPromoConfig.id;

      const spyFind = jest
        .spyOn(promoConfigRepository, 'findOneBy')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await promoConfigRepository.findOnePromo(id);

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spyFind).toHaveBeenCalledTimes(1);
      expect(spyFind).toHaveBeenCalledWith({ id });
    });
  });

  describe('findRequestPromo', () => {
    it('should return promo config with actual trx less than config max trx', async () => {
      // arrange
      requestPromoDto = {
        quantity: 1,
        act_trx: 100000,
      };

      mockPromoConfig = {
        id: faker.datatype.uuid(),
        quantity: requestPromoDto.quantity,
        min_trx: 0,
        max_trx: 200000,
        prosentase: faker.datatype.float(),
        promo_code: faker.datatype.string(),
        promo_quota: faker.datatype.number(),
        promo_period_start: new Date(),
        promo_period_end: new Date(),
        created_at: '2023-01-08T05:41:47.908Z',
        updated_at: '2023-01-08T05:41:47.908Z',
        deleted_at: null,
      };

      const spyFindOne = jest
        .spyOn(promoConfigRepository, 'findOne')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await promoConfigRepository.findRequestPromo(
        requestPromoDto,
      );

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spyFindOne).toHaveBeenCalledTimes(1);
      expect(spyFindOne).toHaveBeenCalledWith({
        where: {
          quantity: requestPromoDto.quantity,
          min_trx: LessThanOrEqual(requestPromoDto.act_trx),
          max_trx: MoreThan(requestPromoDto.act_trx),
        },
      });
    });

    it('should return promo config with actual trx more than equal config max trx', async () => {
      // arrange
      requestPromoDto = {
        quantity: 1,
        act_trx: 1500000,
      };

      mockPromoConfig = {
        id: faker.datatype.uuid(),
        quantity: requestPromoDto.quantity,
        min_trx: 1000000,
        max_trx: null,
        prosentase: faker.datatype.float(),
        promo_code: faker.datatype.string(),
        promo_quota: faker.datatype.number(),
        promo_period_start: new Date(),
        promo_period_end: new Date(),
        created_at: '2023-01-08T05:41:47.908Z',
        updated_at: '2023-01-08T05:41:47.908Z',
        deleted_at: null,
      };

      const spyFindOne = jest
        .spyOn(promoConfigRepository, 'findOne')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await promoConfigRepository.findRequestPromo(
        requestPromoDto,
      );

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spyFindOne).toHaveBeenCalledTimes(1);
      expect(spyFindOne).toHaveBeenCalledWith({
        where: {
          quantity: requestPromoDto.quantity,
          min_trx: LessThanOrEqual(requestPromoDto.act_trx),
          max_trx: IsNull(),
        },
      });
    });
  });
});
