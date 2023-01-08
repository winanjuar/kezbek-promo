import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class RequestPromoDto {
  @IsUUID()
  @IsNotEmpty()
  transaction_id: string;

  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsPositive()
  @IsNotEmpty()
  act_trx: number;
}
