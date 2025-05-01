import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBingoHistoryDto {
    @IsUUID()
    @IsNotEmpty()
    roundId: string;

    @IsUUID()
    @IsNotEmpty()
    cardId: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    attendee_id: string;
}