import { ApiProperty } from '@nestjs/swagger';
import { ConfigDto } from '../../config.dto';
import { BaseResponseDto } from '../base.response.dto';

export class MultiConfigResponseDto extends BaseResponseDto {
  constructor(statusCode: number, message: string, data: ConfigDto[]) {
    super(statusCode, message);
    this.data = data;
  }

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({
    example: 'This is sample message get data successfully',
  })
  message: string;

  @ApiProperty({ type: [ConfigDto] })
  data: ConfigDto[];
}
