import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ProgramDto } from './program.dto';

export class ConfigDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  min_trx: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  max_trx: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  prosentase: number;

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

  @ApiProperty()
  program: ProgramDto;
}
