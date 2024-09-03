import { PartialType } from '@nestjs/swagger';
import { CreateStationDto } from './create-station.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateStationDto extends PartialType(CreateStationDto) {
    
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    representative: string;

    @IsOptional()
    @IsString()
    location: string;

    
    @IsString()
    @IsOptional()
    @IsUUID()
    experienceId?: string;
}
