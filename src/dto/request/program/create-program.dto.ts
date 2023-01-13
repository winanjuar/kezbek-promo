import { PickType } from '@nestjs/swagger';
import { ProgramDto } from 'src/dto/program.dto';

export class CreateProgramDto extends PickType(ProgramDto, [
  'code_key',
  'quota',
  'period_start',
  'period_end',
]) {}
