import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class RequestPromoDto {
  @IsUUID()
  @IsNotEmpty()
  transaction_id;

  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsPositive()
  @IsNotEmpty()
  act_trx: number;
}
