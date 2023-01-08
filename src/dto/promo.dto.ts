import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';

export class PromoDto {
  @ApiProperty()
  @IsUUID()
  id: string;

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

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  min_trx: number;

  @ApiProperty()
  @IsNumber()
  max_trx: number;

  @ApiProperty()
  @IsNumber()
  prosentase: number;

  @ApiProperty()
  @IsString()
  created_at: string;

  @ApiProperty()
  @IsString()
  updated_at: string;

  @ApiProperty()
  @IsString()
  deleted_at: string;
}
