import { Transform } from "class-transformer";
import { IsEmail, IsIn, IsString, MinLength } from "class-validator";
import { User } from "src/common/entities/user.entity";
import { Event } from "src/event/entities/event.entity";
import { genderType } from "src/types/user.types";


export class CreateAssistantDto {

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(5)
    fullName: string;

    @Transform(({ value }) => value.toLowerCase())
    @IsEmail()
    email: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    eventId: string;

    @IsString()
    @IsIn(["male","female"])
    gender: genderType;
}
export class AssistantDto {

    fullName: string;

    user: User;

    event: Event;

    country: string;

    city?: string;

    browser: string;

    plataform: string;
 
}