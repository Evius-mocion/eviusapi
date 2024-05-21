import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class CreateOrganizationDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(6)
    name: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(6)
    avatar: string;
}
