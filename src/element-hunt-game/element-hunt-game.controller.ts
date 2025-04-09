import { Controller, Post, Get, Patch, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ElementHuntGameService } from './element-hunt-game.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateElementHuntGameDto } from './dto/create-element-hunt-game.dto';
import { UpdateElementHuntGameDto, UpdateElementHuntGameStateDto } from './dto/update-element-hunt-game.dto';
import { CreateHiddenPointDto } from './dto/create-hidden-point';

@ApiTags('element-hunt/games')
@Controller('element-hunt/games')
export class ElementHuntGameController {
	constructor(private readonly gameService: ElementHuntGameService) {}

	@Post()
	create(@Body() createDto: CreateElementHuntGameDto) {
		return this.gameService.create(createDto);
	}

	@Get(':id')
	findOne(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.gameService.findOne(id);
	}

	@Get('event/:eventId')
	findByEvent(@Param('eventId', new ParseUUIDPipe()) eventId: string) {
		return this.gameService.findByEventId(eventId);
	}

	@Patch(':id')
	update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateDto: UpdateElementHuntGameDto) {
		return this.gameService.update(id, updateDto);
	}

	@Post(':id/hidden-points')
	addHiddenPoint(@Param('id', ParseUUIDPipe) id: string, @Body() point: CreateHiddenPointDto) {
		return this.gameService.addHiddenPoint(id, point);
	}
	@Delete(':id/hidden-points/:pointId')
	removeHiddenPoint(@Param('id', ParseUUIDPipe) id: string, @Param('pointId', ParseUUIDPipe) pointId: string) {
		return this.gameService.removeHiddenPoint(id, pointId);
	}

	@Post(':id/state')
	setGameState(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateElementHuntGameStateDto) {
		return this.gameService.setGameState(id, body.isPlaying);
	}
}
