import { ApiProperty } from '@nestjs/swagger';
import { ConfigDto } from 'src/dto/config.dto';
import { BaseResponseDto } from '../base.response.dto';

export class CreateConfigResponseDto extends BaseResponseDto {
  constructor(statusCode: number, message: string, data: ConfigDto) {
    super(statusCode, message);
    this.data = data;
  }

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'This is sample message create successfully' })
  message: string;

  @ApiProperty({ type: ConfigDto })
  data: ConfigDto;
}
