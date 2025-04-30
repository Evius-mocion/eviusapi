import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperiencePlayData } from '../entities/experience-play-data.entity';
import { CreateExperiencePlayDataDto } from '../dto/create-experience-play-data.dto';
import { UpdateExperiencePlayDataDto } from '../dto/update-experience-play-data.dto';
import { AttendeeService } from 'src/attendee/attendee.service';
import { EventExperienceService } from './event-experience.service';
import { Attendee } from 'src/attendee/entities/attendee.entity';

@Injectable()
export class ExperiencePlayDataService {
	constructor(
		@InjectRepository(ExperiencePlayData)
		private experiencePlayDataRepo: Repository<ExperiencePlayData>,

		private readonly eventExperienceService: EventExperienceService,

		private readonly attendeeService: AttendeeService
	) {}

	async create(createExperiencePlayDataDto: CreateExperiencePlayDataDto): Promise<ExperiencePlayData> {
		const { eventExperienceId, attendeeId, ...restPLayData } = createExperiencePlayDataDto;

		const eventExperience = await this.eventExperienceService.findOne(eventExperienceId);

		if (!eventExperience.active) {
			throw new BadRequestException('EventExperience is not active');
		}

		let attendee: Attendee | undefined = undefined;
		if (attendeeId) {
			const resp = await this.attendeeService.findOneById(attendeeId);
			attendee = resp.attendee;
		}

		const created = this.experiencePlayDataRepo.create({
			...restPLayData,
			eventExperience,
			event: { id: eventExperience.eventId },
			experience: { id: eventExperience.experienceId },
			attendee,
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
