import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperiencePlayData } from '../entities/experience-play-data.entity';
import { CreateExperiencePlayDataDto } from '../dto/create-experience-play-data.dto';
import { UpdateExperiencePlayDataDto } from '../dto/update-experience-play-data.dto';
import { AttendeeService } from 'src/attendee/attendee.service';
import { EventExperienceService } from './event-experience.service';
import { Attendee } from 'src/attendee/entities/attendee.entity';
import { handleTypeOrmError } from 'src/common/utils/dbErrors';
import { parseExcel } from 'src/common/utils/parser';
import { validate as isUuid } from 'uuid';
import { DataSource } from 'typeorm';
import { EventExperiencePlayDataExcel } from '../types/experience-play-data.type';
import { EventExperience } from '../entities/event-experience.entity';

@Injectable()
export class ExperiencePlayDataService {
	constructor(
		@InjectRepository(ExperiencePlayData)
		private experiencePlayDataRepo: Repository<ExperiencePlayData>,
		private readonly attendeeService: AttendeeService,
		private readonly eventExperienceService: EventExperienceService,
		private readonly dataSource: DataSource // Inject DataSource for transactions
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
		try {
			const created = this.experiencePlayDataRepo.create({
				...restPLayData,
				eventExperience,
				event: { id: eventExperience.eventId },
				experience: { id: eventExperience.experienceId },
				attendee,
			});

			return await this.experiencePlayDataRepo.save(created);
		} catch (error) {
			handleTypeOrmError(error);
		}
	}

	private validatePlayDataItem(item: EventExperiencePlayDataExcel): string[] {
		const errors: string[] = [];
		const { eventExperienceId, attendeeId, score, bonusScore, local_id, play_timestamp, data } = item;

		if (!eventExperienceId || !isUuid(eventExperienceId)) {
			errors.push('Invalid or missing eventExperienceId');
		}
		if (attendeeId && !isUuid(attendeeId)) {
			errors.push('Invalid attendeeId');
		}
		if (score !== undefined && isNaN(Number(score))) {
			errors.push('Invalid score');
		}
		if (bonusScore !== undefined && isNaN(Number(bonusScore))) {
			errors.push('Invalid bonusScore');
		}
		if (!local_id || !isUuid(local_id)) {
			errors.push('Invalid or missing local_id');
		}
		if (!play_timestamp || isNaN(Date.parse(play_timestamp))) {
			errors.push('Invalid or missing play_timestamp');
		}
		if (data !== undefined && data !== null) {
			if (typeof data !== 'string') {
				errors.push('data must be a string');
			} else {
				try {
					const parsed = JSON.parse(data);
					if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
						errors.push('data must be a valid JSON object');
					}
				} catch {
					errors.push('data is not valid JSON');
				}
			}
		}
		return errors;
	}

	private async transformPlayDataItem(
		item: EventExperiencePlayDataExcel,
		manager: Repository<ExperiencePlayData> | any // 'any' for transaction manager
	): Promise<{ entity?: ExperiencePlayData; errors?: string[] }> {
		const errors = this.validatePlayDataItem(item);
		if (errors.length > 0) {
			return { errors };
		}

		const eventExperience = await manager.findOne(EventExperience, {
			where: { id: item.eventExperienceId },
		});
		if (!eventExperience) {
			return { errors: ['EventExperience not found'] };
		}
		if (!eventExperience.active) {
			return { errors: ['EventExperience is not active'] };
		}

		let attendee = undefined;
		if (item.attendeeId) {
			const attendeeResp = await this.attendeeService.findOneById(item.attendeeId);
			attendee = attendeeResp?.attendee;
			if (!attendee) {
				return { errors: ['Attendee not found'] };
			}
		}

		let parsedData: any = undefined;
		if (item.data !== undefined && item.data !== null && typeof item.data === 'string') {
			try {
				parsedData = JSON.parse(item.data);
			} catch {
				// Already validated, so this should not happen
			}
		}

		const entity = manager.create(ExperiencePlayData, {
			eventExperience,
			eventExperienceId: item.eventExperienceId,
			event: { id: eventExperience.eventId },
			eventId: eventExperience.eventId,
			experience: { id: eventExperience.experienceId },
			experienceId: eventExperience.experienceId,
			attendee,
			attendeeId: item.attendeeId,
			play_timestamp: new Date(item.play_timestamp),
			score: item.score !== undefined ? Number(item.score) : undefined,
			bonusScore: item.bonusScore !== undefined ? Number(item.bonusScore) : undefined,
			localId: item.local_id,
			data: parsedData,
		});
		return { entity };
	}

	async importFromExcel(file: Express.Multer.File): Promise<{ imported: any[]; notImported: any[] }> {
		const playDataList = parseExcel(file) as EventExperiencePlayDataExcel[];

		const imported: any[] = [];
		const notImported: any[] = [];

		await this.dataSource.transaction(async (manager) => {
			for (const item of playDataList) {
				const { entity, errors } = await this.transformPlayDataItem(item, manager);
				if (errors && errors.length > 0) {
					notImported.push({ ...item, errors });
					continue;
				}
				try {
					const saved = await manager.save(ExperiencePlayData, entity);
					imported.push(saved);
				} catch (err) {
					notImported.push({ ...item, errors: [err.message || 'Unknown error'] });
				}
			}
		});

		return {
			imported,
			notImported,
		};
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

	async findByAttendeeId(attendeeId: string): Promise<ExperiencePlayData[]> {
		const { attendee } = await this.attendeeService.findOneById(attendeeId);
		return this.experiencePlayDataRepo.find({
			where: {
				attendee: { id: attendeeId },
				eventId: attendee.eventId,
			},
		});
	}
}
