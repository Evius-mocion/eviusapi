import { Transform } from "class-transformer";
import { IsOptional, IsUUID, Min } from "class-validator";

export class PaginationArgs {
    
    @Transform(({value}) => value && parseInt(value))
    @IsOptional()
    @Min(1)
    offset: number = 0;

    @Transform(({value}) => value && parseInt(value))
    @IsOptional()
    @Min(1)
    limit: number = 10;
        
}

export class UuidDto {
    @IsUUID()
    orgId: string;
}