import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString, IsUUID } from "class-validator";

export class checkInDto {

    @Transform(({ value }) => value.trim())
    @IsUUID()
    @IsOptional()
    experienceID?: string;

    @Transform(({ value }) => value.trim())
    @IsUUID()
    @IsOptional()
    stationID?: string;

    @IsString()
    @IsIn(['station','cms', 'landing'])
    @IsOptional()
    type?: string;
}