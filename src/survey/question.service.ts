import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SurveyService } from './survey.service';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PaginationArgs } from 'src/common/dto';
import { Survey } from './entities/survey.entity';
import { QuestionReorderDto } from './dto/reorder-question.dto';

@Injectable()
export class QuestionService {
	constructor(
		@InjectRepository(Question)
		private readonly questionRepository: Repository<Question>,
		private readonly surveyService: SurveyService
	) {}
	async getQuestionsBySurveyId(
		surveyId: string,
		pagination?: PaginationArgs | null
	): Promise<{ questions: Question[]; total: number }> {
		let findOptions = {};

		if (pagination) {
			const offset = pagination.offset ?? 1;
			const limit = pagination.limit ?? 10;
			const skip = (offset - 1) * limit;

			findOptions = { skip, take: limit };
		}

		const [questions, total] = await this.questionRepository.findAndCount({
			...findOptions,
			where: { survey: { id: surveyId } },
			order: { created_at: 'ASC' },
		});

		return { questions, total };
	}

	async getQuestionById(questionId: string): Promise<{ question: Question }> {
		const question = await this.questionRepository.findOne({
			where: { id: questionId },
			relations: ['options'],
		});
		if (!question) {
			throw new NotFoundException(`Question with ID ${questionId} not found`);
		}
		return { question };
	}

	async createQuestion(createQuestionDto: CreateQuestionDto) {
		return this.questionRepository.manager.transaction(async (manager) => {
			// Lock survey row during order calculation
			await manager.findOne(Survey, {
				where: { id: createQuestionDto.surveyId },
				lock: { mode: 'pessimistic_write' },
			});

			const lastQuestion = await manager.findOne(Question, {
				where: { survey: { id: createQuestionDto.surveyId } },
				order: { order: 'DESC' },
			});

			const newOrder = lastQuestion ? lastQuestion.order + 1 : 1;

			const question = manager.create(Question, {
				...createQuestionDto,
				order: newOrder,
				survey: { id: createQuestionDto.surveyId },
			});

			return { question: await manager.save(question) };
		});
	}

	async updateQuestion(questionId: string, updateDto: UpdateQuestionDto): Promise<{ question: Question }> {
		const { question } = await this.getQuestionById(questionId);
		const updated = this.questionRepository.merge(question, updateDto);
		return { question: await this.questionRepository.save(updated) };
	}

	async deleteQuestion(questionId: string): Promise<{ question: Question }> {
		const { question } = await this.getQuestionById(questionId);
		await this.questionRepository.remove(question);
		return { question };
	}

	async reorderQuestions(reorderDto: QuestionReorderDto): Promise<{ success: boolean }> {
		// Get questions with survey relation using TypeORM In operator
		const questions = await this.questionRepository.find({
			where: { id: In(reorderDto.questionIds) },
			relations: ['survey'],
		});

		// Validate all questions belong to the same survey
		const uniqueSurveyIds = new Set(questions.map((q) => q.survey.id));
		if (uniqueSurveyIds.size !== 1) {
			throw new BadRequestException('All questions must belong to the same survey');
		}

		// Create a map for quick position lookup
		const idPositionMap = new Map<string, number>();
		reorderDto.questionIds.forEach((id, index) => idPositionMap.set(id, index));

		// Sort questions according to DTO's ID order
		questions.sort((a, b) => idPositionMap.get(a.id) - idPositionMap.get(b.id));

		// Update order based on array position (starting at 1)
		questions.forEach((question, index) => {
			question.order = index + 1;
		});
		// Save all updates in single query
		await this.questionRepository.save(questions);

		return { success: true };
	}
}
