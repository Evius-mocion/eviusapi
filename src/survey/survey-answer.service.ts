import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyAnswer } from './entities/surveyAnswer.entity';
import { CreateSurveyAnswerDto } from './dto/create-survey-answer.dto';
import { UpdateSurveyAnswerDto } from './dto/update-survey-answer.dto';
import { PaginationArgs } from 'src/common/dto';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { Survey } from './entities/survey.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';

@Injectable()
export class SurveyAnswerService {
	constructor(
		@InjectRepository(SurveyAnswer)
		private readonly answerRepository: Repository<SurveyAnswer>,
		@InjectRepository(Attendee)
		private readonly attendeeRepository: Repository<Attendee>,
		@InjectRepository(Question)
		private readonly questionRepository: Repository<Question>,
		@InjectRepository(Option)
		private readonly optionRepository: Repository<Option>,
		@InjectRepository(Survey)
		private readonly surveyRepository: Repository<Survey>
	) {}

	private async validateEntities(createDto: CreateSurveyAnswerDto) {
		if ((!createDto.optionId && !createDto.response) || (createDto.optionId && createDto.response)) {
			throw new Error('Either option or response must be provided, but not both');
		}

		let option = null;
		if (createDto.optionId) {
			option = await this.optionRepository.findOneBy({ id: createDto.optionId });
			if (!option) throw new NotFoundException('Option not found');
		}

		const [attendee, question, survey] = await Promise.all([
			this.attendeeRepository.findOneBy({ id: createDto.attendeeId }),
			this.questionRepository.findOneBy({ id: createDto.questionId }),
			this.surveyRepository.findOneBy({ id: createDto.surveyId }),
		]);

		if (!attendee) throw new NotFoundException('Attendee not found');
		if (!question) throw new NotFoundException('Question not found');
		if (!survey) throw new NotFoundException('Survey not found');

		const questionBelongsToSurvey = await this.questionRepository.findOne({
			where: {
				id: createDto.questionId,
				survey: { id: createDto.surveyId },
			},
		});
		if (!questionBelongsToSurvey) {
			throw new NotFoundException('Question does not belong to the specified survey');
		}

		if (createDto.optionId) {
			const optionBelongsToQuestion = await this.optionRepository.findOne({
				where: {
					id: createDto.optionId,
					question: { id: createDto.questionId },
				},
			});
			if (!optionBelongsToQuestion) {
				throw new NotFoundException('Option does not belong to the specified question');
			}
		}

		return { attendee, question, option, survey };
	}

	async createAnswer(createDto: CreateSurveyAnswerDto) {
		const { attendee, question, option, survey } = await this.validateEntities(createDto);

		const answer = this.answerRepository.create({
			attendee,
			question,
			option,
			survey,
			response: createDto.response,
		});

		return { answer: await this.answerRepository.save(answer) };
	}

	async getAnswerById(answerId: string) {
		const answer = await this.answerRepository.findOne({
			where: { id: answerId },
			relations: ['attendee', 'question', 'option', 'survey'],
		});

		if (!answer) {
			throw new NotFoundException(`Answer with ID ${answerId} not found`);
		}
		return { answer };
	}

	async getAnswersByAttendee(attendeeId: string, pagination?: PaginationArgs) {
		const { limit = 10, offset = 1 } = pagination || {};
		const skip = (offset - 1) * limit;

		const [answers, total] = await this.answerRepository.findAndCount({
			where: { attendee: { id: attendeeId } },
			relations: ['question', 'option'],
			skip,
			take: limit,
		});

		return { answers, total };
	}

	async getAnswersByQuestion(questionId: string, pagination?: PaginationArgs) {
		const { limit = 10, offset = 1 } = pagination || {};
		const skip = (offset - 1) * limit;

		const [answers, total] = await this.answerRepository.findAndCount({
			where: { question: { id: questionId } },
			relations: ['attendee', 'option'],
			skip,
			take: limit,
		});

		return { answers, total };
	}

	async getAnswersByOption(optionId: string, pagination?: PaginationArgs) {
		const { limit = 10, offset = 1 } = pagination || {};
		const skip = (offset - 1) * limit;

		const [answers, total] = await this.answerRepository.findAndCount({
			where: { option: { id: optionId } },
			relations: ['attendee', 'question'],
			skip,
			take: limit,
		});

		return { answers, total };
	}

	async updateAnswer(answerId: string, updateDto: UpdateSurveyAnswerDto) {
		const { answer } = await this.getAnswerById(answerId);

		// Validate and update relations
		if (updateDto.attendeeId) {
			const attendee = await this.attendeeRepository.findOneBy({ id: updateDto.attendeeId });
			if (!attendee) throw new NotFoundException('Attendee not found');
			answer.attendee = attendee;
		}

		if (updateDto.questionId) {
			const question = await this.questionRepository.findOneBy({ id: updateDto.questionId });
			if (!question) throw new NotFoundException('Question not found');
			answer.question = question;
		}

		if (updateDto.optionId) {
			const option = await this.optionRepository.findOneBy({ id: updateDto.optionId });
			if (!option) throw new NotFoundException('Option not found');
			answer.option = option;
		}

		if (updateDto.surveyId) {
			const survey = await this.surveyRepository.findOneBy({ id: updateDto.surveyId });
			if (!survey) throw new NotFoundException('Survey not found');
			answer.survey = survey;
		}

		return { answer: await this.answerRepository.save(answer) };
	}

	async deleteAnswer(answerId: string) {
		const { answer } = await this.getAnswerById(answerId);
		await this.answerRepository.remove(answer);
		return { answer };
	}	
}
