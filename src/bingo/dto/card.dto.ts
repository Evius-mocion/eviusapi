import { IsNumber, IsBoolean } from 'class-validator';

export class CardDto {
    @IsNumber()
    amount: number;

    @IsBoolean()
    withAttendee: boolean;
}
