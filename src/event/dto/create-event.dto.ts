import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
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
}
