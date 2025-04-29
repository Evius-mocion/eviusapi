import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperiencePlayData } from '../entities/experience-play-data.entity';
import { CreateExperiencePlayDataDto } from '../dto/create-experience-play-data.dto';
import { UpdateExperiencePlayDataDto } from '../dto/update-experience-play-data.dto';
import { EventExperience } from '../entities/event-experience.entity';
import { AttendeeService } from 'src/attendee/attendee.service';

@Injectable()
export class ExperiencePlayDataService {
	constructor(
		@InjectRepository(ExperiencePlayData)
		private experiencePlayDataRepo: Repository<ExperiencePlayData>,
		@InjectRepository(EventExperience)
		private eventExperienceRepo: Repository<EventExperience>,
		private readonly attendeeService: AttendeeService
	) {}

	async create(createExperiencePlayDataDto: CreateExperiencePlayDataDto): Promise<ExperiencePlayData> {
		const { eventExperienceId, attendeeId, play_timestamp, data } = createExperiencePlayDataDto;

		const eventExperience = await this.eventExperienceRepo.findOne({
			where: { id: eventExperienceId },
			relations: ['event', 'experience'],
		});
		if (!eventExperience) {
			throw new NotFoundException('EventExperience not found');
		}
		if (!eventExperience.active) {
			throw new BadRequestException('EventExperience is not active');
		}

		const { attendee } = await this.attendeeService.findOneById(attendeeId);

		const created = this.experiencePlayDataRepo.create({
			eventExperience,
			eventExperienceId,
			event: eventExperience.event,
			eventId: eventExperience.event.id,
			experience: eventExperience.experience,
			experienceId: eventExperience.experience.id,
			attendee: attendee,
			play_timestamp,
			data,
		});
		return await this.experiencePlayDataRepo.save(created);
	}

	async findAll(): Promise<ExperiencePlayData[]> {
		return await this.experiencePlayDataRepo.find();
	}

	async findOne(id: string): Promise<ExperiencePlayData> {
		const found = await this.experiencePlayDataRepo.findOne({ where: { id } });
		if (!found) throw new NotFoundException('ExperiencePlayData not found');
		return found;
	}

	async update(id: string, updateExperiencePlayDataDto: UpdateExperiencePlayDataDto): Promise<ExperiencePlayData> {
		const entity = await this.findOne(id);
		const updated = this.experiencePlayDataRepo.merge(entity, updateExperiencePlayDataDto);
		return await this.experiencePlayDataRepo.save(updated);
	}

	async remove(id: string): Promise<ExperiencePlayData> {
		const entity = await this.findOne(id);
		return await this.experiencePlayDataRepo.remove(entity);
	}

	async findByExperienceId(eventExperienceId: string): Promise<ExperiencePlayData[]> {
		return await this.experiencePlayDataRepo.find({ where: { eventExperience: { id: eventExperienceId } } });
	}
}
