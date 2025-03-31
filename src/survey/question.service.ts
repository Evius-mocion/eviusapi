import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
	constructor(
		@InjectRepository(Question)
		private readonly questionRepository: Repository<Question>
	) {}

	async getQuestionsBySurveyId(surveyId: string): Promise<Question[]> {
		return this.questionRepository.find({ where: { survey: { id: surveyId } } });
	}
}
