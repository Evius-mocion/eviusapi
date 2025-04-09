import {  IsUUID } from 'class-validator';

export class CreateBingoRoundDto {

    @IsUUID()
    figureId: string;
    
    @IsUUID()
    bingoId: string;

}
