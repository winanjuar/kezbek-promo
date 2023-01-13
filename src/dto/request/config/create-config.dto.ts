import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ConfigDto } from 'src/dto/config.dto';

export class CreateConfigDto extends PickType(ConfigDto, [
  'quantity',
  'min_trx',
  'max_trx',
  'prosentase',
]) {
  @ApiProperty()
  @IsString()
  code_key: string;
}
