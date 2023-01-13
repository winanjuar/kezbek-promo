import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class TransactionDto {
  @ApiProperty()
  @IsUUID()
  transaction_id: string;

  @ApiProperty()
  @IsDateString()
  transaction_time: string;

  @ApiProperty()
  @IsUUID()
  customer_id: string;

  @ApiProperty()
  @IsString()
  promo_code: string;

  @ApiProperty()
  @IsNumber()
  quantity_origin: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  act_trx: number;

  @ApiProperty()
  @IsNumber()
  prosentase: number;

  @ApiProperty()
  @IsNumber()
  point: number;

  @ApiProperty()
  @IsDateString()
  created_at: string;

  @ApiProperty()
  @IsDateString()
  updated_at: string;
}
