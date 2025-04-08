import { Controller, Post, Get, Patch, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ElementHuntSessionService } from './element-hunt-session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@ApiTags('element-hunt/sessions')
@Controller('element-hunt/sessions')
export class ElementHuntSessionsController {
	constructor(private readonly sessionService: ElementHuntSessionService) {}

	@Post()
	create(@Body() createDto: CreateSessionDto) {
		return this.sessionService.create(createDto);
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.sessionService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateSessionDto) {
		return this.sessionService.update(id, updateDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.sessionService.remove(id);
	}
}
