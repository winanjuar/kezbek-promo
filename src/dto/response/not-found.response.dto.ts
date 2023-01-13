import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base.response.dto';

export class NotFoundResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({
    example: `This is sample not found message`,
  })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
