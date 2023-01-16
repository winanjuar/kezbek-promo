import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';
import { PromoConstanta } from './core/promo.constanta';
import { IRequestInfoPromo } from './core/request-info-promo.interface';
import { IResponseInfoPromo } from './core/response-info-promo.interface';
import { CreateConfigDto } from './dto/request/config/create-config.dto';
import { EligibleConfigDto } from './dto/request/config/eligible-config.dto';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { CreateProgramDto } from './dto/request/program/create-program.dto';
import { PromoConfig } from './entity/promo-config.entity';
import { PromoProgram } from './entity/promo-program.entity';
import { PromoTransaction } from './entity/promo-transaction.entity';
import { PromoConfigRepository } from './repository/promo-config.repository';
import { PromoProgramRepository } from './repository/promo-program.repository';
import { PromoTransactionRepository } from './repository/promo-transaction.repository';

describe('AppService', () => {
  let appService: AppService;
  let mockPromoProgram: PromoProgram;
  let mockPromoConfig: PromoConfig;
  let mockPromoTransaction: PromoTransaction;

  const promoProgramRepository = {
    createNewProgram: jest.fn(),
    findAllProgram: jest.fn(),
    findOneProgramByCode: jest.fn(),
  };

  const promoConfigRepository = {
    createNewConfig: jest.fn(),
    findAllConfig: jest.fn(),
    findOneConfig: jest.fn(),
    findEligibleConfig: jest.fn(),
  };

  const promoTransactionRepository = {
    createNewTransaction: jest.fn(),
    getTotal: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: PromoProgramRepository, useValue: promoProgramRepository },
        { provide: PromoConfigRepository, useValue: promoConfigRepository },
        {
          provide: PromoTransactionRepository,
          useValue: promoTransactionRepository,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);

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
      quantity: faker.datatype.number(),
      min_trx: faker.datatype.number(),
      max_trx: faker.datatype.number(),
      prosentase: faker.datatype.number(),
      created_at: '2023-01-01T00:02:00Z',
      updated_at: '2023-01-01T00:02:00Z',
      deleted_at: null,
      program: mockPromoProgram,
    };

    mockPromoTransaction = {
      transaction_id: faker.datatype.uuid(),
      transaction_time: '2023-01-05T20:51:39.999Z',
      customer_id: faker.datatype.uuid(),
      promo_code: mockPromoProgram.code_key,
      quantity_origin: mockPromoConfig.quantity,
      quantity: mockPromoConfig.quantity,
      act_trx: faker.datatype.number(),
      prosentase: mockPromoConfig.prosentase,
      point: faker.datatype.number(),
      created_at: '2023-01-08T05:41:47.908Z',
      updated_at: '2023-01-08T05:41:47.908Z',
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAllProgram', () => {
    it('should return all promo program', async () => {
      // arrange
      const spyFindAllProgram = jest
        .spyOn(promoProgramRepository, 'findAllProgram')
        .mockResolvedValue([mockPromoConfig]);

      // act
      const promoPrograms = await appService.findAllProgram();

      // assert
      expect(promoPrograms).toEqual([mockPromoConfig]);
      expect(spyFindAllProgram).toHaveBeenCalledTimes(1);
    });
  });

  describe('createProgram', () => {
    it('should return new program just created', async () => {
      // arrange
      const programDto: CreateProgramDto = {
        code_key: mockPromoProgram.code_key,
        quota: mockPromoProgram.quota,
        period_start: mockPromoProgram.period_start,
        period_end: mockPromoProgram.period_end,
      };
      const spyCreateNewProgram = jest
        .spyOn(promoProgramRepository, 'createNewProgram')
        .mockResolvedValue(mockPromoProgram);

      // act
      const promoProgram = await appService.createProgram(programDto);

      // assert
      expect(promoProgram).toEqual(mockPromoProgram);
      expect(spyCreateNewProgram).toHaveBeenCalledTimes(1);
      expect(spyCreateNewProgram).toHaveBeenCalledWith(programDto);
    });
  });

  describe('findOneProgram', () => {
    it('should return promo program based on code', async () => {
      // arrange
      const code = mockPromoProgram.code_key;

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      // act
      const promoProgram = await appService.findOneProgram(code);

      // assert
      expect(promoProgram).toEqual(mockPromoProgram);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyFindOneProgramByCode).toHaveBeenCalledWith(code);
    });

    it('should throw not found exception', async () => {
      // arrange
      const code = mockPromoProgram.code_key;

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(null);

      // act
      const funFindOneProgram = appService.findOneProgram(code);

      // assert
      await expect(funFindOneProgram).rejects.toEqual(
        new NotFoundException('Program does not exist'),
      );
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyFindOneProgramByCode).toHaveBeenCalledWith(code);
    });
  });

  describe('findAllConfig', () => {
    it('should return all promo config', async () => {
      // arrange
      const spyFindAllConfig = jest
        .spyOn(promoConfigRepository, 'findAllConfig')
        .mockResolvedValue([mockPromoConfig]);

      // act
      const promoConfigs = await appService.findAllConfig();

      // assert
      expect(promoConfigs).toEqual([mockPromoConfig]);
      expect(spyFindAllConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('createConfig', () => {
    it('should return new config just created', async () => {
      // arrange
      const configDto: CreateConfigDto = {
        quantity: mockPromoConfig.quantity,
        min_trx: mockPromoConfig.min_trx,
        max_trx: mockPromoConfig.max_trx,
        prosentase: mockPromoConfig.prosentase,
        code_key: mockPromoProgram.code_key,
      };

      mockPromoConfig.program = mockPromoProgram;

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      const spyCreateNewConfig = jest
        .spyOn(promoConfigRepository, 'createNewConfig')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await appService.createConfig(configDto);

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spyCreateNewConfig).toHaveBeenCalledTimes(1);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
    });

    it('should return new config just created even not sending max_trx', async () => {
      // arrange
      const configDto: CreateConfigDto = {
        quantity: mockPromoConfig.quantity,
        min_trx: mockPromoConfig.min_trx,
        max_trx: mockPromoConfig.max_trx,
        prosentase: mockPromoConfig.prosentase,
        code_key: mockPromoProgram.code_key,
      };

      delete configDto.max_trx;

      mockPromoConfig.program = mockPromoProgram;

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      const spyCreateNewConfig = jest
        .spyOn(promoConfigRepository, 'createNewConfig')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await appService.createConfig(configDto);

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spyCreateNewConfig).toHaveBeenCalledTimes(1);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneConfig', () => {
    it('should return promo config based on code', async () => {
      // arrange
      const id = mockPromoConfig.id;

      const spyFindOneConfig = jest
        .spyOn(promoConfigRepository, 'findOneConfig')
        .mockResolvedValue(mockPromoProgram);

      // act
      const promoProgram = await appService.findOneConfig(id);

      // assert
      expect(promoProgram).toEqual(mockPromoProgram);
      expect(spyFindOneConfig).toHaveBeenCalledTimes(1);
      expect(spyFindOneConfig).toHaveBeenCalledWith(id);
    });

    it('should throw not found exception', async () => {
      // arrange
      const id = mockPromoConfig.id;

      const spyFindOneConfig = jest
        .spyOn(promoConfigRepository, 'findOneConfig')
        .mockResolvedValue(null);

      // act
      const funFindOneConfig = appService.findOneConfig(id);

      // assert
      await expect(funFindOneConfig).rejects.toEqual(
        new NotFoundException('Config does not exist'),
      );
      expect(spyFindOneConfig).toHaveBeenCalledTimes(1);
      expect(spyFindOneConfig).toHaveBeenCalledWith(id);
    });
  });

  describe('findEligibleConfig', () => {
    it('should return eligible config based on request', async () => {
      // arrange
      const eligibleDto: EligibleConfigDto = {
        transaction_time: '2023-01-08T00:00:00Z',
        quantity: mockPromoConfig.quantity,
        act_trx: faker.datatype.number(),
        promo_code: mockPromoProgram.code_key,
      };

      const spyFindEligibleConfig = jest
        .spyOn(promoConfigRepository, 'findEligibleConfig')
        .mockResolvedValue(mockPromoConfig);

      // act
      const promoConfig = await appService.findEligibleConfig(eligibleDto);

      // assert
      expect(promoConfig).toEqual(mockPromoConfig);
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledWith(eligibleDto);
    });
  });

  describe('getRemain', () => {
    it('should return remain transaction based on code', async () => {
      // arrange
      mockPromoProgram.quota = 100;
      const code = mockPromoProgram.code_key;

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      const mockTotal = 4;

      const spyGetTotal = jest
        .spyOn(promoTransactionRepository, 'getTotal')
        .mockResolvedValue(mockTotal);

      const mockResult = {
        program_id: mockPromoProgram.id,
        quota: mockPromoProgram.quota,
        total: mockTotal,
        remain: mockPromoProgram.quota - mockTotal,
      };

      // act
      const remain = await appService.getRemain(code);

      // assert
      expect(remain).toEqual(mockResult);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyGetTotal).toHaveBeenCalledTimes(1);
    });

    it('should throw not found exception when program does not exist', async () => {
      // arrange
      const code = mockPromoProgram.code_key;

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(null);

      const spyGetTotal = jest
        .spyOn(promoTransactionRepository, 'getTotal')
        .mockResolvedValue(0);

      // act
      const funGetRemain = appService.getRemain(code);

      // assert
      await expect(funGetRemain).rejects.toEqual(
        new NotFoundException('Program does not exist'),
      );
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyGetTotal).toHaveBeenCalledTimes(1);
    });
  });

  describe('writeTransaction', () => {
    it('should return new transaction just created', async () => {
      // arrange
      mockPromoTransaction.quantity_origin = 3;

      const transactionDto: CreateTransactionDto = {
        transaction_id: mockPromoTransaction.transaction_id,
        transaction_time: mockPromoTransaction.transaction_time,
        customer_id: mockPromoTransaction.customer_id,
        quantity_origin: mockPromoTransaction.quantity_origin,
        act_trx: mockPromoTransaction.act_trx,
        promo_code: mockPromoTransaction.promo_code,
      };

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      const spyFindEligibleConfig = jest
        .spyOn(promoConfigRepository, 'findEligibleConfig')
        .mockResolvedValue(mockPromoConfig);

      const spyCreateNewTransaction = jest
        .spyOn(promoTransactionRepository, 'createNewTransaction')
        .mockResolvedValue(mockPromoTransaction);

      // act
      const promoTransaction = await appService.writeTransaction(
        transactionDto,
      );

      // assert
      expect(promoTransaction).toEqual(mockPromoTransaction);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateNewTransaction).toHaveBeenCalledTimes(1);
    });

    it('should return new transaction just created, even no eligible promo config', async () => {
      // arrange
      const transactionDto: CreateTransactionDto = {
        transaction_id: mockPromoTransaction.transaction_id,
        transaction_time: mockPromoTransaction.transaction_time,
        customer_id: mockPromoTransaction.customer_id,
        quantity_origin: mockPromoTransaction.quantity_origin,
        act_trx: mockPromoTransaction.act_trx,
        promo_code: mockPromoTransaction.promo_code,
      };

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      const spyFindEligibleConfig = jest
        .spyOn(promoConfigRepository, 'findEligibleConfig')
        .mockResolvedValue(null);

      const spyCreateNewTransaction = jest
        .spyOn(promoTransactionRepository, 'createNewTransaction')
        .mockResolvedValue(mockPromoTransaction);

      // act
      const promoTransaction = await appService.writeTransaction(
        transactionDto,
      );

      // assert
      expect(promoTransaction).toEqual(mockPromoTransaction);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateNewTransaction).toHaveBeenCalledTimes(1);
    });

    it('should return new transaction just created with quantity_origin equal with max qty', async () => {
      // arrange
      mockPromoTransaction.quantity_origin = PromoConstanta.MAX_QUANTITY;

      const transactionDto: CreateTransactionDto = {
        transaction_id: mockPromoTransaction.transaction_id,
        transaction_time: mockPromoTransaction.transaction_time,
        customer_id: mockPromoTransaction.customer_id,
        quantity_origin: mockPromoTransaction.quantity_origin,
        act_trx: mockPromoTransaction.act_trx,
        promo_code: mockPromoTransaction.promo_code,
      };

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      const spyFindEligibleConfig = jest
        .spyOn(promoConfigRepository, 'findEligibleConfig')
        .mockResolvedValue(mockPromoConfig);

      const spyCreateNewTransaction = jest
        .spyOn(promoTransactionRepository, 'createNewTransaction')
        .mockResolvedValue(mockPromoTransaction);

      // act
      const promoTransaction = await appService.writeTransaction(
        transactionDto,
      );

      // assert
      expect(promoTransaction).toEqual(mockPromoTransaction);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateNewTransaction).toHaveBeenCalledTimes(1);
    });

    it('should return new transaction just created with quantity_origin more than max qty', async () => {
      // arrange
      mockPromoTransaction.quantity_origin = 10;

      const transactionDto: CreateTransactionDto = {
        transaction_id: mockPromoTransaction.transaction_id,
        transaction_time: mockPromoTransaction.transaction_time,
        customer_id: mockPromoTransaction.customer_id,
        quantity_origin: mockPromoTransaction.quantity_origin,
        act_trx: mockPromoTransaction.act_trx,
        promo_code: mockPromoTransaction.promo_code,
      };

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      const spyFindEligibleConfig = jest
        .spyOn(promoConfigRepository, 'findEligibleConfig')
        .mockResolvedValue(mockPromoConfig);

      const spyCreateNewTransaction = jest
        .spyOn(promoTransactionRepository, 'createNewTransaction')
        .mockResolvedValue(mockPromoTransaction);

      // act
      const promoTransaction = await appService.writeTransaction(
        transactionDto,
      );

      // assert
      expect(promoTransaction).toEqual(mockPromoTransaction);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateNewTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('processPromoPoint', () => {
    it('should return new transaction with point just created', async () => {
      // arrange
      mockPromoTransaction.quantity_origin = 3;

      const dataReqPromo: IRequestInfoPromo = {
        transaction_id: mockPromoTransaction.transaction_id,
        transaction_time: mockPromoTransaction.transaction_time,
        customer_id: mockPromoTransaction.customer_id,
        quantity_origin: mockPromoTransaction.quantity_origin,
        act_trx: mockPromoTransaction.act_trx,
        promo_code: mockPromoTransaction.promo_code,
      };

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      const spyFindEligibleConfig = jest
        .spyOn(promoConfigRepository, 'findEligibleConfig')
        .mockResolvedValue(mockPromoConfig);

      const spyCreateNewTransaction = jest
        .spyOn(promoTransactionRepository, 'createNewTransaction')
        .mockResolvedValue(mockPromoTransaction);

      const mockResult: IResponseInfoPromo = {
        transaction_id: dataReqPromo.transaction_id,
        prosentase: mockPromoTransaction.prosentase,
        point: mockPromoTransaction.point,
      } as IResponseInfoPromo;

      // act
      const promoTransaction = await appService.processPromoPoint(dataReqPromo);

      // assert
      expect(promoTransaction).toEqual(mockResult);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateNewTransaction).toHaveBeenCalledTimes(1);
    });

    it('should return new transaction with point just created with quantity_origin equal with max qty', async () => {
      // arrange
      mockPromoTransaction.quantity_origin = PromoConstanta.MAX_QUANTITY;

      const dataReqPromo: IRequestInfoPromo = {
        transaction_id: mockPromoTransaction.transaction_id,
        transaction_time: mockPromoTransaction.transaction_time,
        customer_id: mockPromoTransaction.customer_id,
        quantity_origin: mockPromoTransaction.quantity_origin,
        act_trx: mockPromoTransaction.act_trx,
        promo_code: mockPromoTransaction.promo_code,
      };

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      const spyFindEligibleConfig = jest
        .spyOn(promoConfigRepository, 'findEligibleConfig')
        .mockResolvedValue(mockPromoConfig);

      const spyCreateNewTransaction = jest
        .spyOn(promoTransactionRepository, 'createNewTransaction')
        .mockResolvedValue(mockPromoTransaction);

      const mockResult: IResponseInfoPromo = {
        transaction_id: dataReqPromo.transaction_id,
        prosentase: mockPromoTransaction.prosentase,
        point: mockPromoTransaction.point,
      } as IResponseInfoPromo;

      // act
      const promoTransaction = await appService.processPromoPoint(dataReqPromo);

      // assert
      expect(promoTransaction).toEqual(mockResult);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateNewTransaction).toHaveBeenCalledTimes(1);
    });

    it('should return new transaction with point just created with quantity_origin more than max qty', async () => {
      // arrange
      mockPromoTransaction.quantity_origin = 10;

      const dataReqPromo: IRequestInfoPromo = {
        transaction_id: mockPromoTransaction.transaction_id,
        transaction_time: mockPromoTransaction.transaction_time,
        customer_id: mockPromoTransaction.customer_id,
        quantity_origin: mockPromoTransaction.quantity_origin,
        act_trx: mockPromoTransaction.act_trx,
        promo_code: mockPromoTransaction.promo_code,
      };

      const spyFindOneProgramByCode = jest
        .spyOn(promoProgramRepository, 'findOneProgramByCode')
        .mockResolvedValue(mockPromoProgram);

      const spyFindEligibleConfig = jest
        .spyOn(promoConfigRepository, 'findEligibleConfig')
        .mockResolvedValue(mockPromoConfig);

      const spyCreateNewTransaction = jest
        .spyOn(promoTransactionRepository, 'createNewTransaction')
        .mockResolvedValue(mockPromoTransaction);

      const mockResult: IResponseInfoPromo = {
        transaction_id: dataReqPromo.transaction_id,
        prosentase: mockPromoTransaction.prosentase,
        point: mockPromoTransaction.point,
      } as IResponseInfoPromo;

      // act
      const promoTransaction = await appService.processPromoPoint(dataReqPromo);

      // assert
      expect(promoTransaction).toEqual(mockResult);
      expect(spyFindOneProgramByCode).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateNewTransaction).toHaveBeenCalledTimes(1);
    });
  });
});
