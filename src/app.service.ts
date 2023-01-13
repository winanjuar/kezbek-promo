import { Injectable, NotFoundException } from '@nestjs/common';
import { PromoConstanta } from './core/promo.constanta';
import { IRequestInfoPromo } from './core/request-info-promo.interface';
import { IResponseInfoPromo } from './core/response-info-promo.interface';
import { CreateConfigDto } from './dto/request/config/create-config.dto';
import { EligibleConfigDto } from './dto/request/config/eligible-config.dto';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { CreateProgramDto } from './dto/request/program/create-program.dto';
import { PromoConfig } from './entity/promo-config.entity';
import { PromoTransaction } from './entity/promo-transaction.entity';
import { PromoConfigRepository } from './repository/promo-config.repository';
import { PromoProgramRepository } from './repository/promo-program.repository';
import { PromoTransactionRepository } from './repository/promo-transaction.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly promoProgramRepository: PromoProgramRepository,
    private readonly promoConfigRepository: PromoConfigRepository,
    private readonly promoTransactionRepository: PromoTransactionRepository,
  ) {}

  private async __setupPoint(eligibleDto: EligibleConfigDto) {
    const program = await this.findOneProgram(eligibleDto.promo_code);
    if (program) {
      const eligibleConfig = await this.findEligibleConfig(eligibleDto);
      if (eligibleConfig) {
        return {
          prosentase: eligibleConfig.prosentase,
          point: Math.round(
            (Number(eligibleConfig.prosentase) * eligibleDto.act_trx) / 100,
          ),
        };
      }
    }
    return {
      prosentase: 0,
      point: 0,
    };
  }

  async findAllProgram() {
    return await this.promoProgramRepository.findAllProgram();
  }

  async createProgram(programDto: CreateProgramDto) {
    return await this.promoProgramRepository.createNewProgram(programDto);
  }

  async findOneProgram(code: string) {
    const program = await this.promoProgramRepository.findOneProgramByCode(
      code,
    );

    if (!program) {
      throw new NotFoundException('Program does not exist');
    }

    return program;
  }

  async findAllConfig() {
    return await this.promoConfigRepository.findAllConfig();
  }

  async createConfig(configDto: CreateConfigDto) {
    const program = await this.findOneProgram(configDto.code_key);
    const configData: Partial<PromoConfig> = {
      quantity: configDto.quantity,
      min_trx: configDto.min_trx,
      max_trx: configDto.max_trx ? configDto.max_trx : null,
      prosentase: configDto.prosentase,
      program: program,
    };
    return await this.promoConfigRepository.createNewConfig(configData);
  }

  async findOneConfig(id: string) {
    const config = await this.promoConfigRepository.findOneConfig(id);

    if (!config) {
      throw new NotFoundException('Config does not exist');
    }

    return config;
  }

  async findEligibleConfig(eligibleDto: EligibleConfigDto) {
    const eligibleConfig = await this.promoConfigRepository.findEligibleConfig(
      eligibleDto,
    );

    return eligibleConfig;
  }

  async getRemain(promo_code: string) {
    const result = await Promise.all([
      this.findOneProgram(promo_code),
      this.promoTransactionRepository.getTotal(promo_code),
    ]);

    if (result[0]) {
      const quota = result[0].quota;
      const total = result[1];
      const remain = quota - total;
      return {
        quota,
        total,
        remain,
      };
    }
  }

  async writeTransaction(transactionDto: CreateTransactionDto) {
    const quantity =
      transactionDto.quantity_origin > PromoConstanta.MAX_QUANTITY
        ? PromoConstanta.MAX_QUANTITY
        : transactionDto.quantity_origin;

    const eligibleDto: EligibleConfigDto = {
      transaction_time: transactionDto.transaction_time,
      quantity,
      act_trx: transactionDto.act_trx,
      promo_code: transactionDto.promo_code,
    };

    const promoPoint = await this.__setupPoint(eligibleDto);

    const transactionData: Partial<PromoTransaction> = {
      transaction_id: transactionDto.transaction_id,
      transaction_time: transactionDto.transaction_time,
      customer_id: transactionDto.customer_id,
      promo_code: transactionDto.promo_code,
      quantity_origin: transactionDto.quantity_origin,
      quantity,
      act_trx: transactionDto.act_trx,
      prosentase: promoPoint.prosentase,
      point: promoPoint.point,
    };
    return await this.promoTransactionRepository.createNewTransaction(
      transactionData,
    );
  }

  async processPromoPoint(
    dataReqPromo: IRequestInfoPromo,
  ): Promise<IResponseInfoPromo> {
    const quantity =
      dataReqPromo.quantity_origin > PromoConstanta.MAX_QUANTITY
        ? PromoConstanta.MAX_QUANTITY
        : dataReqPromo.quantity_origin;

    const eligibleDto: EligibleConfigDto = {
      transaction_time: dataReqPromo.transaction_time,
      quantity,
      act_trx: dataReqPromo.act_trx,
      promo_code: dataReqPromo.promo_code,
    };

    const promoPoint = await this.__setupPoint(eligibleDto);
    const transactionData: Partial<PromoTransaction> = {
      transaction_id: dataReqPromo.transaction_id,
      transaction_time: dataReqPromo.transaction_time,
      customer_id: dataReqPromo.customer_id,
      promo_code: dataReqPromo.promo_code,
      quantity_origin: dataReqPromo.quantity_origin,
      quantity,
      act_trx: dataReqPromo.act_trx,
      prosentase: promoPoint.prosentase,
      point: promoPoint.point,
    };

    const result = await this.promoTransactionRepository.createNewTransaction(
      transactionData,
    );

    return {
      transaction_id: dataReqPromo.transaction_id,
      prosentase: result.prosentase,
      point: result.point,
    } as IResponseInfoPromo;
  }
}
