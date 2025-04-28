import { Injectable, BadRequestException } from '@nestjs/common';
import { EventExperience } from './entities/event-experience.entity';
import { Repository } from 'typeorm';
import { CreateEventExperienceDto } from './dto/create-event-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExperiencesService } from './experiences.service';
import { EventService } from 'src/event';

@Injectable()
export class EventExperienceService {
	constructor(
		@InjectRepository(EventExperience)
		private readonly eventExperienceRepo: Repository<EventExperience>,
		private readonly eventService: EventService,
		private readonly experienceService: ExperiencesService
	) {}

	async createEventExperience(eventExperienceData: CreateEventExperienceDto) {
		const { eventId, experienceId, location, active } = eventExperienceData;

		const { event } = await this.eventService.getOne(eventId);

		const experience = await this.experienceService.findOne(experienceId);

		const exists = await this.eventExperienceRepo.findOne({
			where: { event: { id: eventId }, experience: { id: experienceId } },
		});

		if (exists) throw new BadRequestException('This event-experience link already exists');

		const eventExperience = this.eventExperienceRepo.create({
			event,
			experience,
			location,
			active,
		});

		return await this.eventExperienceRepo.save(eventExperience);
	}
}
