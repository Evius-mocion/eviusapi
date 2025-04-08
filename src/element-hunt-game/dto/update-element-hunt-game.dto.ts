import { PartialType } from '@nestjs/swagger';
import { CreateElementHuntGameDto } from './create-element-hunt-game.dto';

export class UpdateElementHuntGameDto extends PartialType(CreateElementHuntGameDto) {
	/* @ApiProperty({ required: false })
	@IsOptional()
	@Exclude()
	hidden_points?: never; */
}
