import { Body, Controller, Post } from '@nestjs/common';
import { EventExperienceService } from './event-experience.service';
import { CreateEventExperienceDto } from './dto/create-event-experience.dto';

@Controller('event-experience')
export class EventExperienceController {
	constructor(private readonly eventExperienceService: EventExperienceService) {}

	@Post()
	async create(@Body() eventExperienceData: CreateEventExperienceDto) {
		return await this.eventExperienceService.createEventExperience(eventExperienceData);
	}
}
