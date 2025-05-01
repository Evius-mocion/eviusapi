import { PartialType } from '@nestjs/swagger';
import { CreateBingoDto } from './create-bingo.dto';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class UpdateBingoDto extends PartialType(CreateBingoDto) {

    @IsUUID()
    @IsOptional()
    activityId?: string;

    @IsBoolean()
    @IsOptional()
    status?: boolean;

}
