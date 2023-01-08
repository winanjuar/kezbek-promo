import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { IRequestInfoPromo } from './core/request-info-promo.interface';
import { IResponseInfoPromo } from './core/response-info-promo.interface';
import { CreatePromoDto } from './dto/create-promo.dto';
import { BadRequestResponseDto } from './dto/response/bad-request.response.dto';
import { CreatePromoResponseDto } from './dto/response/create-promo.response.dto';
import { InternalServerErrorResponseDto } from './dto/response/internal-server-error.response.dto';
import { MultiPromoResponseDto } from './dto/response/multi-promo.response.dto';
import { NotFoundResponseDto } from './dto/response/not-found.response.dto';
import { SinglePromoResponseDto } from './dto/response/single-promo.response.dto';
@ApiTags('Promo')
@Controller({ version: '1' })
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @ApiBody({ type: CreatePromoDto })
  @ApiCreatedResponse({ type: CreatePromoResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Post()
  async create(@Body() createPromoDto: CreatePromoDto) {
    try {
      const promoConfig = await this.appService.create(createPromoDto);
      return new CreatePromoResponseDto(
        HttpStatus.CREATED,
        `Create promo successfully`,
        promoConfig,
      );
    } catch (error) {
      this.logger.log(`[POST, /] ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: MultiPromoResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Get()
  async findAll() {
    try {
      const promos = await this.appService.findAll();
      return new MultiPromoResponseDto(
        HttpStatus.OK,
        `Get promo config successfully`,
        promos,
      );
    } catch (error) {
      this.logger.log(`[GET, /] ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: SinglePromoResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const promo = await this.appService.findOnePromo(id);
      return new SinglePromoResponseDto(
        HttpStatus.OK,
        `Get promo ${id} successfully`,
        promo,
      );
    } catch (error) {
      this.logger.log(`[GET, :id] ${error}`);
      throw new InternalServerErrorException();
    }
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
