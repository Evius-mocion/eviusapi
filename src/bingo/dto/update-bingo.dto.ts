import { PartialType } from '@nestjs/swagger';
import { CreateBingoDto } from './create-bingo.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateBingoDto extends PartialType(CreateBingoDto) {

    @IsUUID()
    @IsOptional()
    activityId?: string;

}
