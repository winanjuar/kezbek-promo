import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from 'src/dto/request/program/create-program.dto';
import { PromoProgram } from 'src/entity/promo-program.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PromoProgramRepository extends Repository<PromoProgram> {
  constructor(private readonly dataSource: DataSource) {
    super(PromoProgram, dataSource.createEntityManager());
  }

  async createNewProgram(programDto: CreateProgramDto) {
    return await this.save(programDto);
  }

  async findAllProgram(): Promise<PromoProgram[]> {
    return this.find();
  }

  async findOneProgramByCode(code: string) {
    return this.findOne({ where: { code_key: code } });
  }
}
