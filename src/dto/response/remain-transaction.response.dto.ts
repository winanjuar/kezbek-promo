import { ApiProperty } from '@nestjs/swagger';
import { RemainDto } from '../remain.dto';
import { BaseResponseDto } from './base.response.dto';

export class RemainTrainsactionResponseDto extends BaseResponseDto {
  constructor(statusCode: number, message: string, data: RemainDto) {
    super(statusCode, message);
    this.data = data;
  }

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'This is sample message remain transaction' })
  message: string;

  @ApiProperty({ type: RemainDto })
  data: RemainDto;
}
