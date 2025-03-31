import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SurveyService } from './survey.service';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PaginationArgs } from 'src/common/dto';

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
	        order: { created_at: 'ASC' }
	    });
	    
	    return { questions, total };
	}

	async getQuestionById(questionId: string): Promise<{ question: Question }> {
		const question = await this.questionRepository.findOne({
			where: { id: questionId },
			relations: ['options', 'answers'],
		});
		if (!question) {
			throw new NotFoundException(`Question with ID ${questionId} not found`);
		}
		return { question };
	}

	async createQuestion(createQuestionDto: CreateQuestionDto): Promise<{ question: Question }> {
		// Verify survey exists first
		const survey = await this.surveyService.getById(createQuestionDto.surveyId);

		if (!survey) {
			throw new NotFoundException(`Survey with ID ${createQuestionDto.surveyId} not found`);
		}

		const newQuestion = this.questionRepository.create({
			...createQuestionDto,
			survey: { id: createQuestionDto.surveyId },
		});

		const question = await this.questionRepository.save(newQuestion);
		return { question };
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
}
