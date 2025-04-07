import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ElementHuntGameService } from './element-hunt-game.service';
import { CreateElementHuntGameDto } from './dto/create-element-hunt-game.dto';
import { UpdateElementHuntGameDto } from './dto/update-element-hunt-game.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('element-hunt-game')
@Controller('element-hunt-game')
export class ElementHuntGameController {
	constructor(private readonly elementHuntGameService: ElementHuntGameService) {}

	@Post()
	create(@Body() createElementHuntGameDto: CreateElementHuntGameDto) {
		return this.elementHuntGameService.create(createElementHuntGameDto);
	}

	@Get()
	findAll() {
		return this.elementHuntGameService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.elementHuntGameService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateElementHuntGameDto: UpdateElementHuntGameDto) {
		return this.elementHuntGameService.update(+id, updateElementHuntGameDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.elementHuntGameService.remove(+id);
	}
}
