import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PromoConfigRepository } from './promo-config.repository';
import { PromoConfig } from 'src/entity/promo-config.entity';
import { PromoProgram } from 'src/entity/promo-program.entity';
import { EligibleConfigDto } from 'src/dto/request/config/eligible-config.dto';

describe('PromoConfigRepository', () => {
  let promoConfigRepository: PromoConfigRepository;
  let mockPromoConfig: PromoConfig;
  let mockPromoProgram: PromoProgram;
  let configData: Partial<PromoConfig>;

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

    configData = {
      quantity: faker.datatype.number(),
      min_trx: faker.datatype.number(),
      max_trx: faker.datatype.number(),
      prosentase: faker.datatype.float(),
    };

    mockPromoProgram = {
      id: faker.datatype.uuid(),
      code_key: faker.datatype.string(),
      quota: faker.datatype.number(),
      period_start: '2023-01-01T00:00:00Z',
      period_end: '2023-01-31T23:59:59.999Z',
      created_at: '2023-01-01T00:02:00Z',
      updated_at: '2023-01-01T00:02:00Z',
      deleted_at: null,
      configs: [],
    };

    mockPromoConfig = {
      id: faker.datatype.uuid(),
      quantity: configData.quantity,
      min_trx: configData.min_trx,
      max_trx: configData.max_trx,
      prosentase: configData.prosentase,
      created_at: '2023-01-01T00:02:00Z',
      updated_at: '2023-01-01T00:02:00Z',
      deleted_at: null,
      program: mockPromoProgram,
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('createNewConfig', () => {
    it('should return promo config', async () => {
      // arrange
      const spySave = jest
        .spyOn(promoConfigRepository, 'save')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await promoConfigRepository.createNewConfig(
        configData,
      );

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spySave).toHaveBeenCalledTimes(1);
      expect(spySave).toHaveBeenCalledWith(configData);
    });
  });

  describe('findAllConfig', () => {
    it('should return all promo config', async () => {
      // arrange
      const spyFind = jest
        .spyOn(promoConfigRepository, 'find')
        .mockResolvedValue([mockPromoConfig]);

      // act
      const promoConfigs = await promoConfigRepository.findAllConfig();

      // assert
      expect(promoConfigs).toEqual([mockPromoConfig]);
      expect(spyFind).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneConfig', () => {
    it('should return promo config by id', async () => {
      // arrange
      const id = mockPromoConfig.id;

      const spyFindOne = jest
        .spyOn(promoConfigRepository, 'findOne')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await promoConfigRepository.findOneConfig(id);

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spyFindOne).toHaveBeenCalledTimes(1);
      expect(spyFindOne).toHaveBeenCalledWith({
        relations: ['program'],
        where: { id },
      });
    });
  });

  describe('findEligibleConfig', () => {
    it('should return eligible config as request', async () => {
      // arrange
      const eligibleDto: EligibleConfigDto = {
        transaction_time: '2023-01-08T00:00:00Z',
        quantity: mockPromoConfig.quantity,
        act_trx: faker.datatype.number(),
        promo_code: mockPromoProgram.code_key,
      };

      const spyFindOne = jest
        .spyOn(promoConfigRepository, 'findOne')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await promoConfigRepository.findEligibleConfig(
        eligibleDto,
      );

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spyFindOne).toHaveBeenCalledTimes(1);
    });

    it('should return eligible config as request with act_trx more than max_trx', async () => {
      // arrange
      const eligibleDto: EligibleConfigDto = {
        transaction_time: '2023-01-08T00:00:00Z',
        quantity: mockPromoConfig.quantity,
        act_trx: 2000000,
        promo_code: mockPromoProgram.code_key,
      };

      const spyFindOne = jest
        .spyOn(promoConfigRepository, 'findOne')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await promoConfigRepository.findEligibleConfig(
        eligibleDto,
      );

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spyFindOne).toHaveBeenCalledTimes(1);
    });
  });
});
