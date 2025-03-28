import { Controller, Post, Body, Patch, Param, Get, Query } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { Survey } from './entities/survey.entity';
import { PaginationArgs } from 'src/common/dto';

@Controller('survey')
export class SurveyController {
	constructor(private readonly surveyService: SurveyService) {}

	@Get(':id')
	getById(@Param('id') id: string): Promise<Survey> {
		return this.surveyService.getById(id);
	}

	@Get('eventId/:eventId')
	async findAllByEventId(
		@Param('eventId') eventId: string,
		@Query('nameSearch') nameSearch?: string,
		@Query() pagination?: PaginationArgs
	) {
		console.log('pagination', pagination);
		console.log('nameSearch', nameSearch);
		return this.surveyService.findAllByEventId(eventId, pagination, nameSearch);
	}

	@Post()
	create(@Body() createSurveyDto: CreateSurveyDto) {
		return this.surveyService.create(createSurveyDto);
	}
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
		return this.surveyService.update(id, updateSurveyDto);
	}
	/* 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveyService.findOne(+id);
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveyService.remove(+id);
  } */
}
