import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventExperience } from '../entities/event-experience.entity';
import { CreateEventExperienceDto } from '../dto/create-event-experience.dto';
import { UpdateEventExperienceDto } from '../dto/update-event-experience.dto';

@Injectable()
export class EventExperienceService {
	constructor(
		@InjectRepository(EventExperience)
		private eventExperienceRepository: Repository<EventExperience>
	) {}

	async createEventExperience(createEventExperienceDto: CreateEventExperienceDto): Promise<EventExperience> {
		const eventExperienceValidate = await this.eventExperienceRepository.findOneBy({
			event: { id: createEventExperienceDto.eventId },
			experience: { id: createEventExperienceDto.experienceId },
		});

		if (eventExperienceValidate) {
			throw new ConflictException('Event experience already exists for this event and experience');
		}

		const eventExperience = this.eventExperienceRepository.create(createEventExperienceDto);
		return await this.eventExperienceRepository.save(eventExperience);
	}

	async findOne(id: string): Promise<EventExperience> {
		const eventExperience = await this.eventExperienceRepository.findOneBy({ id });
		if (!eventExperience) {
			throw new NotFoundException(`Event experience with ID ${id} not found`);
		}
		return eventExperience;
	}

	async getAll(): Promise<EventExperience[]> {
		return await this.eventExperienceRepository.find();
	}

	async findByEventId(eventId: string): Promise<EventExperience[]> {
		const eventExperiences = await this.eventExperienceRepository.find({
			where: { event: { id: eventId } },
		});

		if (eventExperiences.length === 0) {
			throw new NotFoundException(`No event experiences found for event ID ${eventId}`);
		}

		return eventExperiences;
	}

	async update(id: string, updateEventExperienceDto: UpdateEventExperienceDto): Promise<EventExperience> {
		const eventExperience = await this.eventExperienceRepository.preload({
			id: id,
			...updateEventExperienceDto,
		});

		if (!eventExperience) {
			throw new NotFoundException(`Event experience with ID ${id} not found`);
		}

		return await this.eventExperienceRepository.save(eventExperience);
	}

	async remove(id: string): Promise<void> {
		const result = await this.eventExperienceRepository.delete(id);

		if (result.affected === 0) {
			throw new NotFoundException(`Event experience with ID ${id} not found`);
		}
	}
}
