import { Controller, Post, Get, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ElementHuntSessionService } from './element-hunt-session.service';
import { CreateSessionDto } from './dto/create-session.dto';

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

	@Post('fault')
	recordFault(@Body() body: { sessionId: string }) {
		return this.sessionService.recordFault(body.sessionId);
	}

	@Post('point')
	recordPoint(@Body() body: { sessionId: string; pointId: string }) {
		return this.sessionService.recordPoint(body.sessionId, body.pointId);
	}
}
