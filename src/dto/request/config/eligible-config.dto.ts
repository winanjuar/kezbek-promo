import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class EligibleConfigDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  transaction_time: string;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  act_trx: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  promo_code: string;
}
