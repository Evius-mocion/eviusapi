import { Controller, Post, Body, Patch, Param, Get, Query, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { Survey } from './entities/survey.entity';
import { PaginationArgs } from 'src/common/dto';

@Controller('survey')
export class SurveyController {
	constructor(private readonly surveyService: SurveyService) {}

	@Get(':surveyId')
	getById(@Param('surveyId', new ParseUUIDPipe()) surveyId: string): Promise<{ survey: Survey }> {
		return this.surveyService.getById(surveyId);
	}

	@Get('event/:eventId')
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
}
