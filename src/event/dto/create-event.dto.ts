import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { Experience } from "src/experiences/entities/experience.entity";
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

  @IsOptional()
  @IsArray()
  landingSections?: ILandingSection[];

  @IsOptional()
  landingDescription?: string;
}
