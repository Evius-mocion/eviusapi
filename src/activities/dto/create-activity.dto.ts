import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { IDates } from "src/types/event.type";

export class CreateActivityDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsArray()
    @IsNotEmpty()
    dates: IDates[];
}
