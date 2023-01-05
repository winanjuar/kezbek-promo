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
import { IRequestInfoPromo } from './core/request-info-promo.interface';
import { IResponseInfoPromo } from './core/response-info-promo.interface';
import { CreatePromoDto } from './dto/create-promo.dto';
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

  @MessagePattern('mp_transaction_point')
  async handleTransactionPoint(
    @Payload() data: IRequestInfoPromo,
  ): Promise<IResponseInfoPromo> {
    try {
      const dataReqPromo: IRequestInfoPromo = {
        transaction_id: data.transaction_id,
        act_trx: data.act_trx,
        quantity: data.quantity,
        promo_code: data.promo_code,
      };

      const promo = await this.appService.processPromo(dataReqPromo);
      this.logger.log(
        `[MessagePattern mp_loyalty_point] [${data.transaction_id}] Calculate promo point successfully`,
      );
      return {
        prosentase: promo.prosentase,
        point: promo.point,
      } as IResponseInfoPromo;
    } catch (error) {
      this.logger.log(`[MessagePattern mp_loyalty_point] ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
