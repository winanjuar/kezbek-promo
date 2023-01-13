import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RemainDto {
  @ApiProperty()
  @IsNumber()
  quota: number;

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsNumber()
  remain: number;
}
