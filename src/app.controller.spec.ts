import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromoConfig } from './entity/promo-config.entity';
import { CreatePromoDto } from './dto/create-promo.dto';
import { SinglePromoResponseDto } from './dto/response/single-promo.response.dto';
import { CreatePromoResponseDto } from './dto/response/create-promo.response.dto';
import { MultiPromoResponseDto } from './dto/response/multi-promo.response.dto';
import { IRequestInfoPromo } from './core/request-info-promo.interface';
import { IResponseInfoPromo } from './core/response-info-promo.interface';

describe('AppController', () => {
  let controller: AppController;

  let mockSingleResponse: SinglePromoResponseDto;
  let mockMultiResponse: MultiPromoResponseDto;
  let mockCreateResponse: CreatePromoResponseDto;

  let mockPromoConfig: PromoConfig;
  let promoDto: CreatePromoDto;

  const mockAppService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOnePromo: jest.fn(),
    processPromo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should response single response promo', async () => {
      // arrange
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
        created_at: '2023-01-08T05:41:47.908Z',
        updated_at: '2023-01-08T05:41:47.908Z',
        deleted_at: null,
      };

      const spyCreate = jest
        .spyOn(mockAppService, 'create')
        .mockResolvedValue(mockPromoConfig);

      mockCreateResponse = new CreatePromoResponseDto(
        HttpStatus.CREATED,
        `Create promo successfully`,
        mockPromoConfig,
      );

      // act
      const response = await controller.create(promoDto);

      // assert
      expect(response).toEqual(mockCreateResponse);
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(promoDto);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
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

      const spyCreate = jest
        .spyOn(mockAppService, 'create')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funCreate = controller.create(promoDto);

      // assert
      await expect(funCreate).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(promoDto);
    });
  });

  describe('findAll', () => {
    it('should response all promo in db', async () => {
      // arrange
      const spyFindAll = jest
        .spyOn(mockAppService, 'findAll')
        .mockResolvedValue([mockPromoConfig]);
      mockMultiResponse = new MultiPromoResponseDto(
        HttpStatus.OK,
        `Get promo config successfully`,
        [mockPromoConfig],
      );

      // act
      const response = await controller.findAll();

      // assert
      expect(response).toEqual(mockMultiResponse);
      expect(spyFindAll).toHaveBeenCalledTimes(1);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const spyFindCustomerById = jest
        .spyOn(mockAppService, 'findAll')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funFindAll = controller.findAll();

      // assert
      await expect(funFindAll).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyFindCustomerById).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should response single promo', async () => {
      // arrange
      const id = faker.datatype.uuid();

      mockPromoConfig = {
        id,
        quantity: faker.datatype.number(),
        min_trx: faker.datatype.number(),
        max_trx: faker.datatype.number(),
        prosentase: faker.datatype.float(),
        promo_code: faker.datatype.string(),
        promo_quota: faker.datatype.number(),
        promo_period_start: new Date(),
        promo_period_end: new Date(),
        created_at: '2023-01-08T05:41:47.908Z',
        updated_at: '2023-01-08T05:41:47.908Z',
        deleted_at: null,
      };

      const spyFindOnePromo = jest
        .spyOn(mockAppService, 'findOnePromo')
        .mockResolvedValue(mockPromoConfig);

      mockSingleResponse = new SinglePromoResponseDto(
        HttpStatus.OK,
        `Get promo ${id} successfully`,
        mockPromoConfig,
      );

      // act
      const response = await controller.findOne(id);

      // assert
      expect(response).toEqual(mockSingleResponse);
      expect(spyFindOnePromo).toHaveBeenCalledTimes(1);
      expect(spyFindOnePromo).toHaveBeenCalledWith(id);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const id = faker.datatype.uuid();
      const spyFindOnePromo = jest
        .spyOn(mockAppService, 'findOnePromo')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funFindOne = controller.findOne(id);

      // assert
      await expect(funFindOne).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyFindOnePromo).toHaveBeenCalledTimes(1);
      expect(spyFindOnePromo).toHaveBeenCalledWith(id);
    });
  });

  describe('handleTransactionPoint', () => {
    it('should process promo and return point promo transaction', async () => {
      // arrange
      const dataReqPromo: IRequestInfoPromo = {
        transaction_id: faker.datatype.uuid(),
        quantity: 4,
        act_trx: faker.datatype.number(),
        promo_code: faker.datatype.string(),
      };

      const prosentase = 1.2;
      const point = (prosentase * dataReqPromo.act_trx) / 100;

      const mockInfoPromo: IResponseInfoPromo = {
        prosentase,
        point,
      };

      const spyProcessPromo = jest
        .spyOn(mockAppService, 'processPromo')
        .mockResolvedValue(mockInfoPromo);

      // act
      const pointTransaction = await controller.handleTransactionPoint(
        dataReqPromo,
      );

      // assert
      expect(pointTransaction).toEqual(mockInfoPromo);
      expect(spyProcessPromo).toHaveBeenCalledTimes(1);
      expect(spyProcessPromo).toHaveBeenCalledWith(dataReqPromo);
    });

    it('should throw internal server error when unknown error occured', async () => {
      // arrange
      const dataReqPromo: IRequestInfoPromo = {
        transaction_id: faker.datatype.uuid(),
        quantity: 4,
        act_trx: faker.datatype.number(),
        promo_code: faker.datatype.string(),
      };

      const spyProcessPromo = jest
        .spyOn(mockAppService, 'processPromo')
        .mockRejectedValue(new InternalServerErrorException());

      // act
      const funHandleTransactionPoint =
        controller.handleTransactionPoint(dataReqPromo);

      // assert
      await expect(funHandleTransactionPoint).rejects.toEqual(
        new InternalServerErrorException(),
      );
      expect(spyProcessPromo).toHaveBeenCalledTimes(1);
      expect(spyProcessPromo).toHaveBeenCalledWith(dataReqPromo);
    });
  });
});
