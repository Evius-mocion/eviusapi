import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SurveyService } from './survey.service';

@Injectable()
export class QuestionService {
	constructor(
		@InjectRepository(Question)
		private readonly questionRepository: Repository<Question>,
		private readonly surveyService: SurveyService
	) {}

	async getQuestionsBySurveyId(surveyId: string): Promise<Question[]> {
		return this.questionRepository.find({ where: { survey: { id: surveyId } } });
	}

	async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
		// Verify survey exists first
		const survey = await this.surveyService.getById(createQuestionDto.surveyId);
		
		if (!survey) {
			throw new NotFoundException(`Survey with ID ${createQuestionDto.surveyId} not found`);
		}

		const newQuestion = this.questionRepository.create({
			...createQuestionDto,
			survey: { id: createQuestionDto.surveyId }
		});

		return this.questionRepository.save(newQuestion);
	}
}
