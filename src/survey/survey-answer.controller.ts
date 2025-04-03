import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { SurveyAnswerService } from './survey-answer.service';
import { CreateSurveyAnswerDto } from './dto/create-survey-answer.dto';
import { UpdateSurveyAnswerDto } from './dto/update-survey-answer.dto';
import { PaginationArgs } from 'src/common/dto';

@Controller('survey/answers')
export class SurveyAnswerController {
  constructor(private readonly answerService: SurveyAnswerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAnswer(@Body() createDto: CreateSurveyAnswerDto) {
    return this.answerService.createAnswer(createDto);
  }

  @Get(':id')
  async getAnswerById(@Param('id') answerId: string) {
    return this.answerService.getAnswerById(answerId);
  }

  @Get('attendee/:attendeeId')
  async getAnswersByAttendee(
    @Param('attendeeId') attendeeId: string,
    @Query() pagination?: PaginationArgs
  ) {
    return this.answerService.getAnswersByAttendee(attendeeId, pagination);
  }

  @Get('question/:questionId')
  async getAnswersByQuestion(
    @Param('questionId') questionId: string,
    @Query() pagination?: PaginationArgs
  ) {
    return this.answerService.getAnswersByQuestion(questionId, pagination);
  }

  @Get('option/:optionId')
  async getAnswersByOption(
    @Param('optionId') optionId: string,
    @Query() pagination?: PaginationArgs
  ) {
    return this.answerService.getAnswersByOption(optionId, pagination);
  }

  @Patch(':id')
  async updateAnswer(
    @Param('id') answerId: string,
    @Body() updateDto: UpdateSurveyAnswerDto
  ) {
    return this.answerService.updateAnswer(answerId, updateDto);
  }

  @Delete(':id')
  async deleteAnswer(@Param('id') answerId: string) {
    return this.answerService.deleteAnswer(answerId);
  }
}