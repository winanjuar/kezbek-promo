import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class CreatePromoDto {
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  min_trx: number;

  @IsPositive()
  @IsOptional()
  max_trx: number;

  @IsPositive()
  @IsNumber()
  prosentase: number;
}
