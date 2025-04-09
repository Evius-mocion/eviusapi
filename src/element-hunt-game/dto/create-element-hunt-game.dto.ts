import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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

	/* @ValidateIf((o) => o.price !== undefined)
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
	image_height?: number = 0; */

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	instruction?: string = '';

	/* @ApiProperty({ type: [HiddenPoints], required: false })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => HiddenPoints)
	@IsOptional()
	hidden_points?: HiddenPoints[]; */

	@ApiProperty()
	@IsUUID()
	@IsNotEmpty()
	eventId: string;

	/* @ApiProperty({ required: false, default: false })
	@IsBoolean()
	@IsOptional()
	isPlaying?: boolean; */
}
