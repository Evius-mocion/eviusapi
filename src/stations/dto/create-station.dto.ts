import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStationDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    representative: string;

    @IsString()
    location: string;

    @IsString()
    @IsUUID()
    eventId: string;

    @IsString()
    @IsOptional()
    @IsUUID()
    experienceId?: string;
}
