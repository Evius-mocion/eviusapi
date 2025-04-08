import { Controller, Post, Get, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ElementHuntSessionService } from './element-hunt-session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { HiddenPoints } from './types/hidden-point';

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

	@Post(':id/fault')
	recordFault(@Param('id', ParseUUIDPipe) id: string) {
		return this.sessionService.recordFault(id);
	}

	@Post(':id/point')
	recordPoint(@Param('id', ParseUUIDPipe) id: string, @Body() pointData: { hiddenPoint: HiddenPoints }) {
		return this.sessionService.recordPoint(id, pointData.hiddenPoint);
	}
}
