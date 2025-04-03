import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Activity } from 'src/activities/entities/activity.entity';
import { Survey } from './entities/survey.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { PaginationArgs } from 'src/common/dto';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class SurveyService {
	constructor(
		@InjectRepository(Survey)
		private readonly surveyRepository: Repository<Survey>,

		@InjectRepository(Event)
		private eventRepository: Repository<Event>,

		@InjectRepository(Activity)
		private readonly activityRepository: Repository<Activity>
	) {}

	async create(createSurveyDto: CreateSurveyDto): Promise<{ survey: Survey }> {
		const { name, eventId, activityId } = createSurveyDto;
		const event = await this.eventRepository.findOneBy({ id: eventId });

		if (!event) {
			throw new Error('Event not found');
		}

		let activity = null;

		if (activityId) {
			activity = await this.activityRepository.findOne({ where: { id: activityId } });
			if (!activity) {
				throw new Error('Activity not found');
			}
		}

		const newSurvey = this.surveyRepository.create({
			name,
			event,
			activity,
		});

		const surveyResult = await this.surveyRepository.save(newSurvey);
		delete surveyResult.event;
		return {
			survey: surveyResult,
		};
	}

	async update(id: string, updateSurveyDto: UpdateSurveyDto): Promise<{ survey: Survey }> {
		const survey = await this.surveyRepository.findOne({ where: { id }, relations: ['event', 'activity'] });
		if (!survey) {
			throw new NotFoundException(`Survey with ID ${id} not found`);
		}

		// Si se proporciona un nuevo evento, validamos que exista
		if (updateSurveyDto.eventId) {
			const event = await this.eventRepository.findOne({ where: { id: updateSurveyDto.eventId } });
			if (!event) {
				throw new NotFoundException(`Event with ID ${updateSurveyDto.eventId} not found`);
			}
			survey.event = event;
		}

		// Si se proporciona una nueva actividad, validamos que exista
		if (updateSurveyDto.activityId) {
			const activity = await this.activityRepository.findOne({ where: { id: updateSurveyDto.activityId } });
			if (!activity) {
				throw new NotFoundException(`Activity with ID ${updateSurveyDto.activityId} not found`);
			}
			survey.activity = activity;
		}

		// Actualizamos solo los campos proporcionados
		Object.assign(survey, updateSurveyDto);
		const surveyResult = await this.surveyRepository.save(survey);
		delete surveyResult.event;
		return {
			survey: surveyResult,
		};
	}

	async findAllByEventId(
		eventId: string,
		pagination?: PaginationArgs,
		nameSearch?: string
	): Promise<{ surveys: Survey[]; total: number }> {
		const defaultLimit = 10;
		const { offset = 0, limit = defaultLimit } = pagination || {};

		const event = await this.eventRepository.findOne({ where: { id: eventId } });
		if (!event) {
			throw new NotFoundException(`Event with ID ${eventId} not found`);
		}

		// Construcción dinámica de condiciones de búsqueda
		const whereCondition: any = { event: { id: event.id } };
		if (nameSearch) {
			whereCondition.name = ILike(`%${nameSearch}%`); // Usa ILike en PostgreSQL
		}

		const [surveys, total] = await this.surveyRepository.findAndCount({
			where: whereCondition,
			skip: (offset - 1) * limit,
			take: limit === 0 ? undefined : limit,
		});

		return { surveys, total };
	}

	async getById(surveyId: string): Promise<{ survey: Survey }> {
		const survey = await this.surveyRepository.findOne({
			where: { id: surveyId },
			relations: ['event', 'activity'],
		});

		if (!survey) {
			throw new NotFoundException(`Survey with ID ${surveyId} not found`);
		}

		return { survey };
	}

	async remove(surveyId: string): Promise<{ message: string }> {
		const survey = await this.surveyRepository.findOne({ where: { id: surveyId } });

		if (!survey) {
			throw new NotFoundException(`Survey with ID ${surveyId} not found`);
		}

		await this.surveyRepository.remove(survey);

		return { message: 'Survey deleted successfully' };
	}
}
