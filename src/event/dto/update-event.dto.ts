import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./create-event.dto";
import { DynamicField, ILandingSection } from "src/types/event.type";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsOptional()
  @IsArray()
  registrationFields?: DynamicField[];

  @IsOptional()
  @IsString()
  organizationAlias?: string;

  @IsOptional()
  @IsString()
  googleAnalyticsId?: string;

  @IsOptional()
  @IsString()
  googleTagManager?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  capacity?: number;

  @IsOptional()
  @IsString()
  faceBookPixelId?: string;

  @IsOptional()
  @IsBoolean()
  hiddenEventDates?: boolean;

  @IsOptional()
  @IsArray()
  landingSections?: ILandingSection[];

  @IsOptional()
  landingDescription?: string;

  @IsOptional()
  @IsArray()
  experiencesId?: string[];
}
