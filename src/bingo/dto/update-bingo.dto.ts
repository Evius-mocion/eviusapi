import { PartialType } from '@nestjs/swagger';
import { CreateBingoDto } from './create-bingo.dto';

export class UpdateBingoDto extends PartialType(CreateBingoDto) {}
