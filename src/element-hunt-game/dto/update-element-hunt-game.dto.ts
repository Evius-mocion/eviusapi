import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateElementHuntGameDto } from './create-element-hunt-game.dto';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateElementHuntGameDto extends PartialType(CreateElementHuntGameDto) {
	@ApiProperty({ required: false })
	@IsOptional()
	@Exclude()
	hidden_points?: never;
}
