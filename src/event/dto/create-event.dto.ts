import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator";
import {
  IEventAppearance,
  IEventSections,
  ILandingSection,
} from "src/types/event.type";

class IDates {
  @IsString()
  startDate: string;
  @IsString()
  endDate: string;
}

export enum EventType {
  ONLINE    = 'online',
  ONSITE = 'onsite',
  PAYMENT   = 'payment',
  HYBRID    = 'hybrid',
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  appearance: IEventAppearance;

  @IsArray()
  @IsNotEmpty()
  dates: IDates[];

  @IsString()
  description: string;

  @IsObject()
  @IsOptional()
  eventSection?: Partial<IEventSections>;

  @IsArray()
  @IsOptional()
  experiencesId: string[];

  @IsEnum(EventType)
  type: EventType;

  @IsOptional()
  @IsPositive()
  capacity?: number;

  @IsOptional()
  @IsArray()
  landingSections?: ILandingSection[];

  @IsOptional()
  landingDescription?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'eventCategories is required' })
  @ArrayMaxSize(3, { message: 'There can be a maximum of 3 event categories.' })
  @IsUUID('4', { each: true, message: 'UUID invalid' })
  eventCategories: string[];

  @IsArray()
  @ArrayMinSize(1, { message: 'eventSectors is required' })
  @ArrayMaxSize(3, { message: 'There can be a maximum of 3 event sectors.' })
  @IsUUID('4', { each: true, message: 'UUID invalid' })
  eventSectors: string[];
}
