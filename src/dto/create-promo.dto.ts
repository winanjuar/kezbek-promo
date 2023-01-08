import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreatePromoDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  min_trx: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  max_trx: number;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  prosentase: number;

  @ApiProperty()
  @IsString()
  promo_code: string;

  @ApiProperty()
  @IsNumber()
  promo_quota: number;

  @ApiProperty()
  @IsDate()
  promo_period_start: Date;

  @ApiProperty()
  @IsDate()
  promo_period_end: Date;
}
