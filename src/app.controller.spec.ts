import {
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IRequestInfoPromo } from './core/request-info-promo.interface';
import { IResponseInfoPromo } from './core/response-info-promo.interface';
import { MultiProgramResponseDto } from './dto/response/program/multi-program.response.dto';
import { PromoProgram } from './entity/promo-program.entity';
import { CreateProgramDto } from './dto/request/program/create-program.dto';
import { SingleProgramResponseDto } from './dto/response/program/single-program.response.dto';
import { CodeProgramDto } from './dto/request/program/code-program.dto';
import { PromoConfig } from './entity/promo-config.entity';
import { MultiConfigResponseDto } from './dto/response/config/multi-config.response.dto';
import { CreateConfigDto } from './dto/request/config/create-config.dto';
import { CreateConfigResponseDto } from './dto/response/config/create-config.response.dto';
import { SingleConfigResponseDto } from './dto/response/config/single-config.response.dto';
import { EligibleConfigDto } from './dto/request/config/eligible-config.dto';
import { RemainTrainsactionResponseDto } from './dto/response/remain-transaction.response.dto';
import { PromoTransaction } from './entity/promo-transaction.entity';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { CreateProgramResponseDto } from './dto/response/program/create-program.response.dto';
import { CreateTransactionResponseDto } from './dto/response/create-transaction.response.dto';

describe('AppController', () => {
  let controller: AppController;
  let mockPromoProgram: PromoProgram;
  let mockPromoConfig: PromoConfig;
  let mockPromoTransaction: PromoTransaction;

  const appService = {
    findAllProgram: jest.fn(),
    createProgram: jest.fn(),
    findOneProgram: jest.fn(),
    findAllConfig: jest.fn(),
    createConfig: jest.fn(),
    findOneConfig: jest.fn(),
    findEligibleConfig: jest.fn(),
    getRemain: jest.fn(),
    writeTransaction: jest.fn(),
    processPromoPoint: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appService }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAllProgram', () => {
    beforeEach(async () => {
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
    });

    it('should response multi program response', async () => {
      // arrange
      const spyFindAllProgram = jest
        .spyOn(appService, 'findAllProgram')
        .mockResolvedValue([mockPromoProgram]);

      const mockResponse = new MultiProgramResponseDto(
        HttpStatus.OK,
        `Get promo program successfully`,
        [mockPromoProgram],
      );

      // act
      const response = await controller.findAllProgram();

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyFindAllProgram).toHaveBeenCalledTimes(1);
      expect(spyFindAllProgram).toHaveBeenCalledWith();
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyFindAllProgram = jest
        .spyOn(appService, 'findAllProgram')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funFindAllProgram = controller.findAllProgram();

      // assert
      await expect(funFindAllProgram).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyFindAllProgram).toHaveBeenCalledTimes(1);
      expect(spyFindAllProgram).toHaveBeenCalledWith();
    });
  });
  describe('createProgram', () => {
    let programDto: CreateProgramDto;

    beforeEach(async () => {
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

      programDto = {
        code_key: mockPromoProgram.code_key,
        quota: mockPromoProgram.quota,
        period_start: mockPromoProgram.period_start,
        period_end: mockPromoProgram.period_end,
      };
    });

    it('should response program just created', async () => {
      // arrange
      const spyCreateProgram = jest
        .spyOn(appService, 'createProgram')
        .mockResolvedValue(mockPromoProgram);

      const mockResponse = new CreateProgramResponseDto(
        HttpStatus.CREATED,
        `Create program successfully`,
        mockPromoProgram,
      );

      // act
      const response = await controller.createProgram(programDto);

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyCreateProgram).toHaveBeenCalledTimes(1);
      expect(spyCreateProgram).toHaveBeenCalledWith(programDto);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyCreateProgram = jest
        .spyOn(appService, 'createProgram')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funCreateProgram = controller.createProgram(programDto);

      // assert
      await expect(funCreateProgram).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyCreateProgram).toHaveBeenCalledTimes(1);
      expect(spyCreateProgram).toHaveBeenCalledWith(programDto);
    });
  });

  describe('findOneProgram', () => {
    let codeProgramDto: CodeProgramDto;

    beforeEach(async () => {
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

      codeProgramDto = {
        code_key: mockPromoProgram.code_key,
      };
    });

    it('should response single program response', async () => {
      // arrange
      const spyFindOneProgram = jest
        .spyOn(appService, 'findOneProgram')
        .mockResolvedValue(mockPromoProgram);

      const mockResponse = new SingleProgramResponseDto(
        HttpStatus.OK,
        `Get program successfully`,
        mockPromoProgram,
      );

      // act
      const response = await controller.getProgram(codeProgramDto);

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyFindOneProgram).toHaveBeenCalledTimes(1);
      expect(spyFindOneProgram).toHaveBeenCalledWith(codeProgramDto.code_key);
    });

    it('should throw not found when program does not exist', async () => {
      // arrange
      const spyFindOneProgram = jest
        .spyOn(appService, 'findOneProgram')
        .mockRejectedValue(new NotFoundException('Program does not exist'));

      // act
      const funGetProgram = controller.getProgram(codeProgramDto);

      // assert
      await expect(funGetProgram).rejects.toEqual(
        new NotFoundException('Program does not exist'),
      );
      expect(spyFindOneProgram).toHaveBeenCalledTimes(1);
      expect(spyFindOneProgram).toHaveBeenCalledWith(codeProgramDto.code_key);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyFindOneProgram = jest
        .spyOn(appService, 'findOneProgram')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funGetProgram = controller.getProgram(codeProgramDto);

      // assert
      await expect(funGetProgram).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyFindOneProgram).toHaveBeenCalledTimes(1);
      expect(spyFindOneProgram).toHaveBeenCalledWith(codeProgramDto.code_key);
    });
  });

  describe('findAllConfig', () => {
    beforeEach(async () => {
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
    });

    it('should response multi config response', async () => {
      // arrange
      const spyFindAllConfig = jest
        .spyOn(appService, 'findAllConfig')
        .mockResolvedValue([mockPromoConfig]);

      const mockResponse = new MultiConfigResponseDto(
        HttpStatus.OK,
        `Get promo config successfully`,
        [mockPromoConfig],
      );

      // act
      const response = await controller.findAllConfig();

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyFindAllConfig).toHaveBeenCalledTimes(1);
      expect(spyFindAllConfig).toHaveBeenCalledWith();
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyFindAllConfig = jest
        .spyOn(appService, 'findAllConfig')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funFindAllConfig = controller.findAllConfig();

      // assert
      await expect(funFindAllConfig).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyFindAllConfig).toHaveBeenCalledTimes(1);
      expect(spyFindAllConfig).toHaveBeenCalledWith();
    });
  });

  describe('createConfig', () => {
    let configDto: CreateConfigDto;

    beforeEach(async () => {
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

      configDto = {
        quantity: mockPromoConfig.quantity,
        min_trx: mockPromoConfig.min_trx,
        max_trx: mockPromoConfig.max_trx,
        prosentase: mockPromoConfig.prosentase,
        code_key: mockPromoProgram.code_key,
      };
    });

    it('should response config just created', async () => {
      // arrange
      const spyCreateConfig = jest
        .spyOn(appService, 'createConfig')
        .mockResolvedValue(mockPromoConfig);

      const mockResponse = new CreateConfigResponseDto(
        HttpStatus.CREATED,
        `Create promo config successfully`,
        mockPromoConfig,
      );

      // act
      const response = await controller.createConfig(configDto);

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyCreateConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateConfig).toHaveBeenCalledWith(configDto);
    });

    it('should throw not found when program does not exist', async () => {
      // arrange
      const spyCreateConfig = jest
        .spyOn(appService, 'createConfig')
        .mockRejectedValue(new NotFoundException('Program does not exist'));

      // act
      const funCreateConfig = controller.createConfig(configDto);

      // assert
      await expect(funCreateConfig).rejects.toEqual(
        new NotFoundException('Program does not exist'),
      );
      expect(spyCreateConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateConfig).toHaveBeenCalledWith(configDto);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyCreateConfig = jest
        .spyOn(appService, 'createConfig')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funCreateConfig = controller.createConfig(configDto);

      // assert
      await expect(funCreateConfig).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyCreateConfig).toHaveBeenCalledTimes(1);
      expect(spyCreateConfig).toHaveBeenCalledWith(configDto);
    });
  });

  describe('findOneConfig', () => {
    let id: string;
    beforeEach(async () => {
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

      id = mockPromoConfig.id;
    });

    it('should response single config response', async () => {
      // arrange
      const spyFindOneConfig = jest
        .spyOn(appService, 'findOneConfig')
        .mockResolvedValue(mockPromoConfig);

      const mockResponse = new SingleConfigResponseDto(
        HttpStatus.OK,
        `Get promo config successfully`,
        mockPromoConfig,
      );

      // act
      const response = await controller.findOneConfig(id);

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyFindOneConfig).toHaveBeenCalledTimes(1);
      expect(spyFindOneConfig).toHaveBeenCalledWith(id);
    });

    it('should throw not found when config does not exists', async () => {
      // arrange
      const spyFindOneConfig = jest
        .spyOn(appService, 'findOneConfig')
        .mockRejectedValue(new NotFoundException('Config does not exist'));

      // act
      const funFindOneConfig = controller.findOneConfig(id);

      // assert
      await expect(funFindOneConfig).rejects.toEqual(
        new NotFoundException('Config does not exist'),
      );
      expect(spyFindOneConfig).toHaveBeenCalledTimes(1);
      expect(spyFindOneConfig).toHaveBeenCalledWith(id);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyFindOneConfig = jest
        .spyOn(appService, 'findOneConfig')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funFindOneConfig = controller.findOneConfig(id);

      // assert
      await expect(funFindOneConfig).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyFindOneConfig).toHaveBeenCalledTimes(1);
      expect(spyFindOneConfig).toHaveBeenCalledWith(id);
    });
  });

  describe('findEligibleConfig', () => {
    let eligibleDto: EligibleConfigDto;

    beforeEach(async () => {
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

      eligibleDto = {
        transaction_time: '2023-01-08T00:00:00Z',
        quantity: mockPromoConfig.quantity,
        act_trx: faker.datatype.number(),
        promo_code: mockPromoProgram.code_key,
      };
    });

    it('should return eligible config based on request', async () => {
      // arrange
      const spyFindEligibleConfig = jest
        .spyOn(appService, 'findEligibleConfig')
        .mockResolvedValue(mockPromoConfig);

      const mockResponse = new SingleConfigResponseDto(
        HttpStatus.OK,
        `Get eligible promo successfully`,
        mockPromoConfig,
      );

      // act
      const response = await controller.findEligibleConfig(eligibleDto);

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledWith(eligibleDto);
    });

    it('should throw not found when eligible config does not exists', async () => {
      // arrange
      const spyFindEligibleConfig = jest
        .spyOn(appService, 'findEligibleConfig')
        .mockRejectedValue(
          new NotFoundException('No eligible config was found'),
        );

      // act
      const funFindEligibleConfig = controller.findEligibleConfig(eligibleDto);

      // assert
      await expect(funFindEligibleConfig).rejects.toEqual(
        new NotFoundException('No eligible config was found'),
      );
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledWith(eligibleDto);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyFindEligibleConfig = jest
        .spyOn(appService, 'findEligibleConfig')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funFindEligibleConfig = controller.findEligibleConfig(eligibleDto);

      // assert
      await expect(funFindEligibleConfig).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyFindEligibleConfig).toHaveBeenCalledTimes(1);
      expect(spyFindEligibleConfig).toHaveBeenCalledWith(eligibleDto);
    });
  });

  describe('getRemain', () => {
    let code: string;

    beforeEach(async () => {
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

      code = mockPromoProgram.code_key;
    });

    it('should return remain quota of program', async () => {
      // arrange
      mockPromoProgram.quota = 100;

      const mockTotal = 4;

      const mockResult = {
        quota: mockPromoProgram.quota,
        total: mockTotal,
        remain: mockPromoProgram.quota - mockTotal,
      };

      const spyGetRemain = jest
        .spyOn(appService, 'getRemain')
        .mockResolvedValue(mockResult);

      const mockResponse = new RemainTrainsactionResponseDto(
        HttpStatus.OK,
        `Get remain quota successfully`,
        mockResult,
      );

      // act
      const response = await controller.getRemain(code);

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyGetRemain).toHaveBeenCalledTimes(1);
      expect(spyGetRemain).toHaveBeenCalledWith(code);
    });

    it('should throw not found program does not exist', async () => {
      // arrange
      const spyGetRemain = jest
        .spyOn(appService, 'getRemain')
        .mockRejectedValue(new NotFoundException('Program does not exist'));

      // act
      const funGetRemain = controller.getRemain(code);

      // assert
      await expect(funGetRemain).rejects.toEqual(
        new NotFoundException('Program does not exist'),
      );
      expect(spyGetRemain).toHaveBeenCalledTimes(1);
      expect(spyGetRemain).toHaveBeenCalledWith(code);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyGetRemain = jest
        .spyOn(appService, 'getRemain')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funGetRemain = controller.getRemain(code);

      // assert
      await expect(funGetRemain).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyGetRemain).toHaveBeenCalledTimes(1);
      expect(spyGetRemain).toHaveBeenCalledWith(code);
    });
  });

  describe('transactionPromoPoint', () => {
    let transactionDto: CreateTransactionDto;

    beforeEach(async () => {
      mockPromoTransaction = {
        transaction_id: faker.datatype.uuid(),
        transaction_time: '2023-01-05T20:51:39.999Z',
        customer_id: faker.datatype.uuid(),
        promo_code: faker.datatype.string(),
        quantity_origin: faker.datatype.number(),
        quantity: faker.datatype.number(),
        act_trx: faker.datatype.number(),
        prosentase: faker.datatype.number(),
        point: faker.datatype.number(),
        created_at: '2023-01-08T05:41:47.908Z',
        updated_at: '2023-01-08T05:41:47.908Z',
      };

      transactionDto = {
        transaction_id: mockPromoTransaction.transaction_id,
        transaction_time: mockPromoTransaction.transaction_time,
        customer_id: mockPromoTransaction.customer_id,
        quantity_origin: mockPromoTransaction.quantity_origin,
        act_trx: mockPromoTransaction.act_trx,
        promo_code: mockPromoTransaction.promo_code,
      };
    });

    it('should response transaction just written', async () => {
      // arrange
      const spyWriteTransaction = jest
        .spyOn(appService, 'writeTransaction')
        .mockResolvedValue(mockPromoTransaction);

      const mockResponse = new CreateTransactionResponseDto(
        HttpStatus.CREATED,
        `Write transaction successfully`,
        mockPromoTransaction,
      );

      // act
      const response = await controller.transactionPromoPoint(transactionDto);

      // assert
      expect(response).toEqual(mockResponse);
      expect(spyWriteTransaction).toHaveBeenCalledTimes(1);
      expect(spyWriteTransaction).toHaveBeenCalledWith(transactionDto);
    });

    it('should throw not found when promo does not exist', async () => {
      // arrange
      const spyWriteTransaction = jest
        .spyOn(appService, 'writeTransaction')
        .mockRejectedValue(new NotFoundException('Program does not exist'));

      // act
      const funTransactionPromoPoint =
        controller.transactionPromoPoint(transactionDto);

      // assert
      await expect(funTransactionPromoPoint).rejects.toEqual(
        new NotFoundException('Program does not exist'),
      );
      expect(spyWriteTransaction).toHaveBeenCalledTimes(1);
      expect(spyWriteTransaction).toHaveBeenCalledWith(transactionDto);
    });
    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyWriteTransaction = jest
        .spyOn(appService, 'writeTransaction')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funTransactionPromoPoint =
        controller.transactionPromoPoint(transactionDto);

      // assert
      await expect(funTransactionPromoPoint).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyWriteTransaction).toHaveBeenCalledTimes(1);
      expect(spyWriteTransaction).toHaveBeenCalledWith(transactionDto);
    });
  });

  describe('handleTransactionPoint', () => {
    let dataReqPromo: IRequestInfoPromo;

    beforeEach(async () => {
      mockPromoTransaction = {
        transaction_id: faker.datatype.uuid(),
        transaction_time: '2023-01-05T20:51:39.999Z',
        customer_id: faker.datatype.uuid(),
        promo_code: faker.datatype.string(),
        quantity_origin: faker.datatype.number(),
        quantity: faker.datatype.number(),
        act_trx: faker.datatype.number(),
        prosentase: faker.datatype.number(),
        point: faker.datatype.number(),
        created_at: '2023-01-08T05:41:47.908Z',
        updated_at: '2023-01-08T05:41:47.908Z',
      };
    });
    it('should process promo and return point promo transaction', async () => {
      // arrange
      dataReqPromo = {
        transaction_id: mockPromoTransaction.transaction_id,
        customer_id: mockPromoTransaction.customer_id,
        transaction_time: mockPromoTransaction.transaction_time,
        quantity_origin: mockPromoTransaction.quantity_origin,
        act_trx: mockPromoTransaction.act_trx,
        promo_code: mockPromoTransaction.promo_code,
      };

      const mockResult: IResponseInfoPromo = {
        transaction_id: dataReqPromo.transaction_id,
        prosentase: mockPromoTransaction.prosentase,
        point: mockPromoTransaction.point,
      } as IResponseInfoPromo;

      const spyProcessPromoPoint = jest
        .spyOn(appService, 'processPromoPoint')
        .mockResolvedValue(mockResult);

      // act
      const pointTransaction = await controller.handleTransactionPoint(
        dataReqPromo,
      );

      // assert
      expect(pointTransaction).toEqual(mockResult);
      expect(spyProcessPromoPoint).toHaveBeenCalledTimes(1);
      expect(spyProcessPromoPoint).toHaveBeenCalledWith(dataReqPromo);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyProcessPromoPoint = jest
        .spyOn(appService, 'processPromoPoint')
        .mockRejectedValue(new NotFoundException('Program does not exist'));

      // act
      const funHandleTransactionPoint =
        controller.handleTransactionPoint(dataReqPromo);

      // assert
      await expect(funHandleTransactionPoint).rejects.toEqual(
        new NotFoundException('Program does not exist'),
      );
      expect(spyProcessPromoPoint).toHaveBeenCalledTimes(1);
      expect(spyProcessPromoPoint).toHaveBeenCalledWith(dataReqPromo);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyProcessPromoPoint = jest
        .spyOn(appService, 'processPromoPoint')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funHandleTransactionPoint =
        controller.handleTransactionPoint(dataReqPromo);

      // assert
      await expect(funHandleTransactionPoint).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyProcessPromoPoint).toHaveBeenCalledTimes(1);
      expect(spyProcessPromoPoint).toHaveBeenCalledWith(dataReqPromo);
    });
  });
});
