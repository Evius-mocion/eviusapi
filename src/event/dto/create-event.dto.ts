import { IsArray, IsObject, IsOptional, IsString } from "class-validator";
import { IEventAppearance, IEventSections } from "src/types/event.type";

export class CreateEventDto {
    @IsString()
    name: string;
    
    @IsObject()
    appearance: IEventAppearance;

    @IsArray()
    dates: string[];
    
    @IsObject()
    @IsOptional()
    eventSection?: Partial<IEventSections>;
}



