import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { HiddenPoints } from '../types/hidden-point';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSessionDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsArray()
	found_points?: HiddenPoints[];

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	remaining_lives?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBoolean()
	finished?: boolean;
}
