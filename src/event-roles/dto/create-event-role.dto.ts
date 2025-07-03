import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateEventRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    number: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    votingPoints: number;
}
