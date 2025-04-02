import { Transform } from "class-transformer";
import { IsEnum, IsIn, IsOptional, IsUUID, Min } from "class-validator";
import { CheckInType } from "src/types/attendee.type";

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
    email?: string;

    @IsOptional()
    fullName?: string;

    @IsOptional()
    @IsEnum(CheckInType)
    checkInType?: CheckInType;

    @IsOptional()
    checkInAt?: string;

    @IsOptional()
    @IsIn(['email', 'fullName', 'checkInAt', 'checkInType'])
    orderBy?: string;

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: string;
}

export class UuidDto {
    @IsUUID()
    eventId: string;
}