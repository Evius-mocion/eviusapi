import { IsNumber, IsBoolean, IsUUID } from 'class-validator';

export class CardDto {
    @IsNumber()
    amount: number;

    @IsBoolean()
    withAttendee: boolean;

    @IsUUID()
    bingoId: string;
}
