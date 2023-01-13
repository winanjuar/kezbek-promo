import { PickType } from '@nestjs/swagger';
import { TransactionDto } from '../transaction.dto';

export class CreateTransactionDto extends PickType(TransactionDto, [
  'transaction_id',
  'transaction_time',
  'customer_id',
  'quantity_origin',
  'act_trx',
  'promo_code',
]) {}
