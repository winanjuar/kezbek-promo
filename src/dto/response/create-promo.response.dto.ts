import { ApiProperty } from '@nestjs/swagger';
import { CreatePromoDto } from '../create-promo.dto';
import { BaseResponseDto } from './base.response.dto';

export class CreatePromoResponseDto extends BaseResponseDto {
  constructor(statusCode: number, message: string, data: CreatePromoDto) {
    super(statusCode, message);
    this.data = data;
  }

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Create new partner successfully' })
  message: string;

  @ApiProperty({ type: CreatePromoDto })
  data: CreatePromoDto;
}
