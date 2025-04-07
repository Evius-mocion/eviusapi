import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HiddenPoints } from '../types/hidden-point';
import { Type } from 'class-transformer';
import { DEFAULT_MAX_LIVES } from 'src/common/constants/elementHunt.constants';

export class CreateElementHuntGameDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	image_url?: string = '';

	@ApiProperty({
		description: 'Maximum allowed lives for participants',
		default: DEFAULT_MAX_LIVES,
		required: false,
	})
	@IsNumber()
	@IsPositive()
	@IsOptional()
	max_lives?: number;

	@ValidateIf((o) => o.price !== undefined)
	@ApiProperty({ required: false })
	@IsNumber()
	@IsOptional()
	@IsPositive()
	image_width?: number = 0;

	@ValidateIf((o) => o.price !== undefined)
	@ApiProperty({ required: false })
	@IsNumber()
	@IsOptional()
	@IsPositive()
	image_height?: number = 0;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	instruction?: string = '';

	@ApiProperty({ required: false })
	@IsNumber()
	@IsPositive()
	@IsOptional()
	max_attempts?: number = 3;

	@ApiProperty({ type: [HiddenPoints], required: false })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => HiddenPoints)
	@IsOptional()
	hidden_points?: HiddenPoints[];

	@ApiProperty()
	@IsUUID()
	@IsNotEmpty()
	eventId: string;
}
