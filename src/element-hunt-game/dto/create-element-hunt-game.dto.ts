import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HiddenPoints } from '../types/hidden-point';
import { Type } from 'class-transformer';

export class CreateElementHuntGameDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	image_url: string;

	@ApiProperty()
	@IsNumber()
	@IsPositive()
	image_width: number;

	@ApiProperty()
	@IsNumber()
	@IsPositive()
	image_height: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	instruction: string;

	@ApiProperty()
	@IsNumber()
	@IsPositive()
	max_attempts: number;

	@ApiProperty({ type: [HiddenPoints] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => HiddenPoints)
	hidden_points: HiddenPoints[];

	@ApiProperty()
	@IsUUID()
	@IsNotEmpty()
	eventId: string;
}
