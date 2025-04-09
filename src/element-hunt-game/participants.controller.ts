import { Controller, Post, Get, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ElementHuntParticipantService } from './element-hunt-participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@ApiTags('element-hunt/participants')
@Controller('element-hunt/participants')
export class ElementHuntParticipantController {
	constructor(private readonly participantService: ElementHuntParticipantService) {}
	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.participantService.findOne(id);
	}
	@Post()
	create(@Body() createDto: CreateParticipantDto) {
		return this.participantService.create(createDto);
	}

	@Get('byGame/:gameId')
	findByGame(@Param('gameId', ParseUUIDPipe) gameId: string) {
		return this.participantService.findByGame(gameId);
	}

	@Get('byAttendee/:attendeeId')
	findByUser(@Param('attendeeId', ParseUUIDPipe) attendeeId: string) {
		return this.participantService.findByAttendee(attendeeId);
	}

	/* @Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.participantService.remove(id);
	} */
}
