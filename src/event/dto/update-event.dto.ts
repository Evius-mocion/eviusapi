import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./create-event.dto";
import { DynamicField, ILandingSection } from "src/types/event.type";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

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
  @IsString()
  faceBookPixelId?: string;

  @IsOptional()
  @IsBoolean()
  hiddenEventDates?: boolean;

  @IsOptional()
  @IsArray()
  landingSections?: ILandingSection[];
}
