import { PartialType } from '@nestjs/swagger';
import { CreateElementHuntGameDto } from './create-element-hunt-game.dto';
import { Exclude } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateElementHuntGameDto extends PartialType(CreateElementHuntGameDto) {
	@Exclude()
	isPlaying?: never;
}

export class UpdateElementHuntGameStateDto {
	@IsBoolean()
	isPlaying: boolean;
}
