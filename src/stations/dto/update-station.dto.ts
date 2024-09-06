import { PartialType } from '@nestjs/swagger';
import { CreateStationDto } from './create-station.dto';
import { IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

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
	@ValidateIf((o) => o.experienceId !== '')
    @IsUUID()
    experienceId?: string;

    @IsString()
    @IsOptional()
	country: string;
	@IsString()
    @IsOptional()
	department: string;
	@IsString()
    @IsOptional()
	city: string;
}
