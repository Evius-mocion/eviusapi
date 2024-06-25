import { IsArray, IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { IEventAppearance, IEventSections, typeEvent } from "src/types/event.type";

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsObject()
    appearance: IEventAppearance;

    @IsArray()
    dates: string[];

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsIn(['virtual' , 'physical' , 'mixto'])
    type: typeEvent;

    @IsObject()
    @IsOptional()
    eventSection?: Partial<IEventSections>;
}



