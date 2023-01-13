import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto } from '../transaction.dto';
import { BaseResponseDto } from './base.response.dto';

export class CreateTransactionResponseDto extends BaseResponseDto {
  constructor(statusCode: number, message: string, data: TransactionDto) {
    super(statusCode, message);
    this.data = data;
  }

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'This is sample message create successfully' })
  message: string;

  @ApiProperty({ type: TransactionDto })
  data: TransactionDto;
}
