import { Controller, Post, Get, Patch, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ElementHuntGameService } from './element-hunt-game.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateElementHuntGameDto } from './dto/create-element-hunt-game.dto';
import { UpdateElementHuntGameDto } from './dto/update-element-hunt-game.dto';
import { HiddenPoints } from './types/hidden-point';

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

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.gameService.remove(id);
	}

	@Post(':id/hidden-points')
	async addHiddenPoint(@Param('id', ParseUUIDPipe) id: string, @Body() point: Omit<HiddenPoints, 'id'>) {
		return this.gameService.addHiddenPoint(id, point);
	}
}
