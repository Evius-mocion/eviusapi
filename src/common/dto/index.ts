import { Transform } from "class-transformer";
import { IsOptional, IsUUID, Min } from "class-validator";

export class PaginationArgs {
    
    @Transform(({value}) => value && parseInt(value))
    @IsOptional()
    @Min(1)
    offset: number = 1;

    @Transform(({value}) => value && parseInt(value))
    @IsOptional()
    @Min(1)
    limit: number = 10;
        
}

export class FilterAttendeeArgs {
    @IsOptional()
    email: string;

    @IsOptional()
    fullName: string;

    @IsOptional()
    checkInType: string;

    @IsOptional()
    checkInAt: string;

    @IsOptional()
    orderBy: string;
}

export class UuidDto {
    @IsUUID()
    orgId: string;
}