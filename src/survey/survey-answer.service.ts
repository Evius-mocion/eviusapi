import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyAnswer } from './entities/surveyAnswer.entity';
import { CreateSurveyAnswerDto } from './dto/create-survey-answer.dto';
import { UpdateSurveyAnswerDto } from './dto/update-survey-answer.dto';
import { PaginationArgs } from 'src/common/dto';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';
import { QuestionType } from './enums/question-type.enum';

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
		private readonly optionRepository: Repository<Option>
	) {}

	private async validateEntities(createDto: CreateSurveyAnswerDto) {
		const { attendeeId, questionId, optionId, response } = createDto;

		const { attendee, option, question } = await this.findEntities(attendeeId, questionId, optionId);

		this.validateQuestionType(question, optionId, response);
		this.validateQuestionAndOption(question, option);
		this.validateEventRelationship(question, attendee);

		return { attendee, question, option };
	}

	private async findEntities(attendeeId: string, questionId: string, optionId?: string) {
		const [attendee, question, option] = await Promise.all([
			this.attendeeRepository.findOne({ where: { id: attendeeId }, relations: ['event'] }),
			this.questionRepository.findOne({ where: { id: questionId }, relations: ['survey.event'] }),
			optionId ? this.optionRepository.findOne({ where: { id: optionId }, relations: ['question'] }) : null,
		]);

		return { attendee, question, option };
	}

	private validateQuestionType(question: Question, optionId?: string, response?: string) {
		const validations = {
			[QuestionType.TEXT]: () => {
				if (!response || optionId) {
					throw new BadRequestException('Las preguntas de tipo texto solo deben recibir una respuesta y no una opción.');
				}
			},
			[QuestionType.MULTIPLE_CHOICE]: () => {
				if (!optionId || response) {
					throw new BadRequestException('Las preguntas de opción múltiple deben recibir solo una opción y no una respuesta.');
				}
			},
			[QuestionType.SINGLE_CHOICE]: () => {
				if (!optionId || response) {
					throw new BadRequestException('Las preguntas de opción única deben recibir solo una opción y no una respuesta.');
				}
			},
		};

		if (validations[question.type]) {
			validations[question.type]();
		} else {
			throw new BadRequestException('Tipo de pregunta no válido.');
		}
	}

	private validateQuestionAndOption(question: Question, option?: Option) {
		if (option && option.question.id !== question.id) {
			throw new BadRequestException('La opción no pertenece a la pregunta especificada');
		}
	}

	private validateEventRelationship(question: Question, attendee: Attendee) {
		if (question.survey.event.id !== attendee.event.id) {
			throw new BadRequestException('La pregunta no pertenece al evento del asistente');
		}
	}

	async createAnswer(createDto: CreateSurveyAnswerDto) {
		const { attendee, option, question } = await this.validateEntities(createDto);

		const answer = this.answerRepository.create({
			attendee,
			option,
			question,
			response: createDto.response,
		});

		return { answer: await this.answerRepository.save(answer) };
	}

	async getAnswerById(answerId: string) {
		const answer = await this.answerRepository.findOne({
			where: { id: answerId },
			relations: ['attendee', 'question', 'option'],
		});

		if (!answer) {
			throw new NotFoundException(`Answer with ID ${answerId} not found`);
		}
		return { answer };
	}
	async getAnswersByQuestion(questionId: string, pagination?: PaginationArgs) {
		const { limit = 10, offset = 1 } = pagination || {};
		const skip = (offset - 1) * limit;

		const [answers, total] = await this.answerRepository.findAndCount({
			where: { question: { id: questionId } },
			relations: ['attendee', 'option', 'question'],
			skip,
			take: limit,
		});

		return { answers, total };
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

	async getAnswersByOption(optionId: string, pagination?: PaginationArgs) {
		const { limit = 10, offset = 1 } = pagination || {};
		const skip = (offset - 1) * limit;

		const [answers, total] = await this.answerRepository.findAndCount({
			where: { option: { id: optionId } },
			relations: ['attendee', 'question', 'question'],
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

		if (updateDto.optionId) {
			const option = await this.optionRepository.findOne({
				where: { id: updateDto.optionId },
				relations: ['question.survey.event'],
			});
			console.log('option', option);
			if (!option) throw new NotFoundException('Option not found');

			// Validate event consistency
			/* if (option.question.survey.eventId !== answer.attendee.event.id) {
				throw new BadRequestException('La opción no pertenece al evento del asistente');
			} */

			answer.option = option;
			answer.response = null; // Clear response when setting option
		}

		if (updateDto.response) {
			if (answer.option) {
				throw new BadRequestException('Cannot set response when answer has an option');
			}
			answer.response = updateDto.response;
		}

		return { answer: await this.answerRepository.save(answer) };
	}

	async deleteAnswer(answerId: string) {
		const { answer } = await this.getAnswerById(answerId);
		await this.answerRepository.remove(answer);
		return { answer, message: 'Answer deleted successfully' };
	}
}
