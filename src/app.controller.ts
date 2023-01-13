import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
import { CodeProgramDto } from './dto/request/program/code-program.dto';
import { BadRequestResponseDto } from './dto/response/bad-request.response.dto';
import { InternalServerErrorResponseDto } from './dto/response/internal-server-error.response.dto';
import { NotFoundResponseDto } from './dto/response/not-found.response.dto';
import { CreateProgramResponseDto } from './dto/response/program/create-program.response.dto';
import { SingleProgramResponseDto } from './dto/response/program/single-program.response.dto';
import { CreateProgramDto } from './dto/request/program/create-program.dto';
import { CreateConfigDto } from './dto/request/config/create-config.dto';
import { CreateConfigResponseDto } from './dto/response/config/create-config.response.dto';
import { MultiConfigResponseDto } from './dto/response/config/multi-config.response.dto';
import { SingleConfigResponseDto } from './dto/response/config/single-config.response.dto';
import { EligibleConfigDto } from './dto/request/config/eligible-config.dto';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { MultiProgramResponseDto } from './dto/response/program/multi-program.response.dto';
import { RemainTrainsactionResponseDto } from './dto/response/remain-transaction.response.dto';
import { CreateTransactionResponseDto } from './dto/response/create-transaction.response.dto';

@ApiTags('Promo')
@Controller({ version: '1' })
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ type: MultiProgramResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Get('program')
  async findAllProgram() {
    try {
      const configs = await this.appService.findAllProgram();
      return new MultiProgramResponseDto(
        HttpStatus.OK,
        `Get promo program successfully`,
        configs,
      );
    } catch (error) {
      this.logger.log(`[GET, /program] ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @ApiBody({ type: CreateProgramDto })
  @ApiCreatedResponse({ type: CreateProgramResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Post('program')
  async createProgram(@Body() programDto: CreateProgramDto) {
    try {
      const program = await this.appService.createProgram(programDto);
      return new CreateProgramResponseDto(
        HttpStatus.CREATED,
        `Create program successfully`,
        program,
      );
    } catch (error) {
      this.logger.log(`[POST, /program] ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: SingleProgramResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Get('program/:code_key')
  async getProgram(@Param() programDto: CodeProgramDto) {
    try {
      const program = await this.appService.findOneProgram(programDto.code_key);
      return new CreateProgramResponseDto(
        HttpStatus.OK,
        `Get program successfully`,
        program,
      );
    } catch (error) {
      this.logger.log(`[GET, /program/:code] ${error}`);
      if (error.response.statusCode === 404) {
        throw new NotFoundException(error.response.message);
      } else {
        throw new InternalServerErrorException(error.response.message);
      }
    }
  }

  @ApiOkResponse({ type: MultiConfigResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Get('config')
  async findAllConfig() {
    try {
      const configs = await this.appService.findAllConfig();
      return new MultiConfigResponseDto(
        HttpStatus.OK,
        `Get promo config successfully`,
        configs,
      );
    } catch (error) {
      this.logger.log(`[GET, /config] ${error}`);
      throw new InternalServerErrorException();
    }
  }

  @ApiBody({ type: CreateConfigDto })
  @ApiCreatedResponse({ type: CreateConfigResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Post('config')
  async createConfig(@Body() configDto: CreateConfigDto) {
    try {
      const promoConfig = await this.appService.createConfig(configDto);
      return new CreateConfigResponseDto(
        HttpStatus.CREATED,
        `Create promo config successfully`,
        promoConfig,
      );
    } catch (error) {
      this.logger.log(`[POST, /config] ${error}`);
      if (error.response.statusCode === 404) {
        throw new NotFoundException(error.response.message);
      } else {
        throw new InternalServerErrorException(error.response.message);
      }
    }
  }

  @ApiOkResponse({ type: SingleConfigResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Get('config/:id')
  async findOneConfig(@Param('id') id: string) {
    try {
      const config = await this.appService.findOneConfig(id);
      return new SingleConfigResponseDto(
        HttpStatus.OK,
        `Get promo config successfully`,
        config,
      );
    } catch (error) {
      this.logger.log(`[GET, config/:id] ${error}`);
      if (error.response.statusCode === 404) {
        throw new NotFoundException(error.response.message);
      } else {
        throw new InternalServerErrorException(error.response.message);
      }
    }
  }

  @ApiBody({ type: EligibleConfigDto })
  @ApiOkResponse({ type: SingleConfigResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @HttpCode(200)
  @Post('eligible')
  async findEligibleConfig(@Body() eligibleDto: EligibleConfigDto) {
    try {
      const config = await this.appService.findEligibleConfig(eligibleDto);
      return new SingleConfigResponseDto(
        HttpStatus.OK,
        `Get eligible promo successfully`,
        config,
      );
    } catch (error) {
      this.logger.log(`[GET, config/:id] ${error}`);
      if (error.response.statusCode === 404) {
        throw new NotFoundException(error.response.message);
      } else {
        throw new InternalServerErrorException(error.response.message);
      }
    }
  }

  @ApiOkResponse({ type: RemainTrainsactionResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Get('remain/:code')
  async getRemain(@Param('code') code: string) {
    try {
      const remain = await this.appService.getRemain(code);
      return new RemainTrainsactionResponseDto(
        HttpStatus.OK,
        'Get remain quota successfully',
        remain,
      );
    } catch (error) {
      this.logger.log(`[GET, remain/:code] ${error}`);
      if (error.response.statusCode === 404) {
        throw new NotFoundException(error.response.message);
      } else {
        throw new InternalServerErrorException(error.response.message);
      }
    }
  }

  @ApiBody({ type: CreateTransactionDto })
  @ApiCreatedResponse({ type: CreateTransactionResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto })
  @Post('transaction')
  async transactionPromoPoint(@Body() transactionDto: CreateTransactionDto) {
    try {
      const transaction = await this.appService.writeTransaction(
        transactionDto,
      );
      return new CreateTransactionResponseDto(
        HttpStatus.CREATED,
        `Write transaction successfully`,
        transaction,
      );
    } catch (error) {
      this.logger.log(`[POST, /transaction] ${error}`);
      if (error.response.statusCode === 404) {
        throw new NotFoundException(error.response.message);
      } else {
        throw new InternalServerErrorException(error.response.message);
      }
    }
  }

  @MessagePattern('mp_transaction_point')
  async handleTransactionPoint(
    @Payload() data: IRequestInfoPromo,
  ): Promise<IResponseInfoPromo> {
    try {
      const dataReqPromo: IRequestInfoPromo = {
        transaction_id: data.transaction_id,
        transaction_time: data.transaction_time,
        customer_id: data.customer_id,
        act_trx: data.act_trx,
        quantity_origin: data.quantity_origin,
        promo_code: data.promo_code,
      };

      const promo = await this.appService.processPromoPoint(dataReqPromo);
      this.logger.log(
        `[MessagePattern mp_loyalty_point] [${data.transaction_id}] Calculate promo point successfully`,
      );
      return {
        transaction_id: promo.transaction_id,
        prosentase: promo.prosentase,
        point: promo.point,
      } as IResponseInfoPromo;
    } catch (error) {
      this.logger.log(`[MessagePattern mp_loyalty_point] ${error}`);
      if (error.response.statusCode === 404) {
        throw new NotFoundException(error.response.message);
      } else {
        throw new InternalServerErrorException(error.response.message);
      }
    }
  }
}
