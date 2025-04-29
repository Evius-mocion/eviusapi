import { Body, Controller, Post, Get, Patch, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { EventExperienceService } from './services/event-experience.service';
import { CreateEventExperienceDto } from './dto/create-event-experience.dto';
import { UpdateEventExperienceDto } from './dto/update-event-experience.dto';

@Controller('event-experience')
export class EventExperienceController {
	constructor(private readonly eventExperienceService: EventExperienceService) {}

	@Post()
	async create(@Body() eventExperienceData: CreateEventExperienceDto) {
		const eventExperience = await this.eventExperienceService.createEventExperience(eventExperienceData);
		return { eventExperience };
	}

	@Get(':id')
	async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
		const eventExperience = await this.eventExperienceService.findOne(id);
		return { eventExperience };
	}

	@Get('by-event/:eventId')
	async findByEventId(@Param('eventId', new ParseUUIDPipe()) eventId: string) {
		const eventExperiences = await this.eventExperienceService.findByEventId(eventId);
		return { eventExperiences };
	}

	@Patch(':id')
	async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateEventExperienceDto: UpdateEventExperienceDto) {
		const eventExperience = await this.eventExperienceService.update(id, updateEventExperienceDto);
		return { eventExperience };
	}

	@Delete(':id')
	async remove(@Param('id', new ParseUUIDPipe()) id: string) {
		await this.eventExperienceService.remove(id);
		return { message: 'Event experience deleted successfully' };
	}
}
