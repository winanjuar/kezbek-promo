import { PickType } from '@nestjs/swagger';
import { ProgramDto } from '../../program.dto';

export class CodeProgramDto extends PickType(ProgramDto, ['code_key']) {}
