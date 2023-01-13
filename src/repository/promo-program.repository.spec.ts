import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PromoProgramRepository } from './promo-program.repository';
import { PromoProgram } from 'src/entity/promo-program.entity';
import { CreateProgramDto } from 'src/dto/request/program/create-program.dto';

describe('PromoProgramRepository', () => {
  let promoProgramRepository: PromoProgramRepository;
  let mockPromoProgram: PromoProgram;
  let programDto: CreateProgramDto;

  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromoProgramRepository,
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    promoProgramRepository = module.get<PromoProgramRepository>(
      PromoProgramRepository,
    );

    programDto = {
      code_key: faker.datatype.string(),
      quota: faker.datatype.number(),
      period_start: '2023-01-01T00:00:00Z',
      period_end: '2023-01-31T23:59:59.999Z',
    };

    mockPromoProgram = {
      ...programDto,
      id: faker.datatype.uuid(),
      created_at: '2023-01-01T00:02:00Z',
      updated_at: '2023-01-01T00:02:00Z',
      deleted_at: null,
      configs: [],
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('createNewProgram', () => {
    it('should return new promo program', async () => {
      // arrange
      const spySave = jest
        .spyOn(promoProgramRepository, 'save')
        .mockResolvedValue(mockPromoProgram);

      // act
      const promoProgram = await promoProgramRepository.createNewProgram(
        programDto,
      );

      // assert
      expect(promoProgram).toEqual(mockPromoProgram);
      expect(spySave).toHaveBeenCalledTimes(1);
      expect(spySave).toHaveBeenCalledWith(programDto);
    });
  });

  describe('findAllProgram', () => {
    it('should return all promo program', async () => {
      // arrange
      const spyFind = jest
        .spyOn(promoProgramRepository, 'find')
        .mockResolvedValue([mockPromoProgram]);

      // act
      const promoPrograms = await promoProgramRepository.findAllProgram();

      // assert
      expect(promoPrograms).toEqual([mockPromoProgram]);
      expect(spyFind).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneProgramByCode', () => {
    it('should return one promo program by code', async () => {
      // arrange
      const code = programDto.code_key;

      const spyFindOne = jest
        .spyOn(promoProgramRepository, 'findOne')
        .mockResolvedValue(mockPromoProgram);

      // act
      const promoProgram = await promoProgramRepository.findOneProgramByCode(
        code,
      );

      // assert
      expect(promoProgram).toEqual(mockPromoProgram);
      expect(spyFindOne).toHaveBeenCalledTimes(1);
      expect(spyFindOne).toHaveBeenCalledWith({ where: { code_key: code } });
    });
  });
});
