import { ApiProperty } from '@nestjs/swagger';
import { ProgramDto } from 'src/dto/program.dto';
import { BaseResponseDto } from '../base.response.dto';

export class SingleProgramResponseDto extends BaseResponseDto {
  constructor(statusCode: number, message: string, data: ProgramDto) {
    super(statusCode, message);
    this.data = data;
  }

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({
    example: 'This is sample message get data successfully',
  })
  message: string;

  @ApiProperty({ type: ProgramDto })
  data: ProgramDto;
}
