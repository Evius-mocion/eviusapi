import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateOrganizationDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(3)
    name: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    avatar: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
