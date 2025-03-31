import { Controller, Post, Body, Patch, Param, Get, Query, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { Survey } from './entities/survey.entity';
import { PaginationArgs } from 'src/common/dto';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

//ToDO: Agregar validaciones por rol.

@Controller('survey')
export class SurveyController {
	constructor(
		private readonly surveyService: SurveyService,
		private readonly questionService: QuestionService
	) {}
	//* ---------------------------- Surveys ----------------------------
	@Get(':surveyId')
	getById(@Param('surveyId', new ParseUUIDPipe()) surveyId: string): Promise<{ survey: Survey }> {
		return this.surveyService.getById(surveyId);
	}

	@Get('get-all-by-event/:eventId')
	async findAllByEventId(
		@Param('eventId', new ParseUUIDPipe()) eventId: string,
		@Query('nameSearch') nameSearch?: string,
		@Query() pagination?: PaginationArgs
	) {
		return this.surveyService.findAllByEventId(eventId, pagination, nameSearch);
	}

	@Post()
	create(@Body() createSurveyDto: CreateSurveyDto) {
		return this.surveyService.create(createSurveyDto);
	}

	@Patch(':surveyId')
	update(@Param('surveyId', new ParseUUIDPipe()) surveyId: string, @Body() updateSurveyDto: UpdateSurveyDto) {
		return this.surveyService.update(surveyId, updateSurveyDto);
	}

	@Delete(':surveyId')
	remove(@Param('surveyId', new ParseUUIDPipe()) surveyId: string) {
		return this.surveyService.remove(surveyId);
	}

	//* ---------------------------- Questions ------------------------------
	@Get('questions/:surveyId')
	getQuestionsBySurveyId(@Param('surveyId', new ParseUUIDPipe()) surveyId: string) {
		return this.questionService.getQuestionsBySurveyId(surveyId);
	}

	@Get('questions/get/:id')
	getQuestionById(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.questionService.getQuestionById(id);
	}

	@Post('questions/create')
	createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
		return this.questionService.createQuestion(createQuestionDto);
	}

	@Patch('questions/update/:id')
	updateQuestion(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateDto: UpdateQuestionDto) {
		return this.questionService.updateQuestion(id, updateDto);
	}

	@Delete('questions/delete/:id')
	deleteQuestion(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.questionService.deleteQuestion(id);
	}
}
