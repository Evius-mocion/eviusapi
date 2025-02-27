import { IsArray, IsNotEmpty, IsString, } from 'class-validator';

export class MasivecheckInDto {

    @IsNotEmpty()
    @IsArray()
    attendees: string[]

    @IsString()
    @IsNotEmpty()
    date: string;

}
