import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProgramDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  code_key: string;

  @ApiProperty()
  @IsNumber()
  quota: number;

  @ApiProperty()
  @IsDateString()
  period_start: string;

  @ApiProperty()
  @IsDateString()
  period_end: string;

  @ApiProperty()
  @IsDateString()
  created_at: string;

  @ApiProperty()
  @IsDateString()
  updated_at: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  deleted_at: string;
}
