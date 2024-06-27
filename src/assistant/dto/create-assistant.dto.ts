import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";
import { User } from "src/common/entities/user.entity";
import { Event } from "src/event/entities/event.entity";


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
    event_id: string;
    
    @IsBoolean()
    TRM: boolean;
}
export class AssistantDto {

    fullName: string;

    user: User;

    event: Event;

    TRM: boolean;

}