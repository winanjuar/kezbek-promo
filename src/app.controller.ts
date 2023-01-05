import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { RequestPromoDto } from './dto/request-promo.dto';
import { IPromoResponse } from './interface/promo-response.interface';
@Controller({ version: '1' })
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Post()
  create(@Body() createPromoDto: CreatePromoDto) {
    return this.appService.create(createPromoDto);
  }

  @Get()
  findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.findOnePromo(id);
  }

  @Post('promo')
  processPromo(@Body() requestPromoDto: RequestPromoDto) {
    return this.appService.processPromo(requestPromoDto);
  }

  @MessagePattern('mp_transaction_point')
  async handleTransactionPoint(@Payload() data: any) {
    try {
      const promoDto: RequestPromoDto = {
        transaction_id: data.transaction_id,
        act_trx: data.act_trx,
        quantity: data.quantity,
      };

      const promo = await this.appService.processPromo(promoDto);
      this.logger.log(
        `[MessagePattern mp_loyalty_point] ${promo.transaction_id} Calculate promo point successfully`,
      );
      return {
        transaction_id: promo.transaction_id,
        prosentase: promo.prosentase,
        point: promo.point,
      } as IPromoResponse;
    } catch (error) {
      this.logger.log(`[MessagePattern mp_loyalty_point] ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
