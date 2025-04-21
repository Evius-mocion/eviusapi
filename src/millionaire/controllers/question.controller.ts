import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { MillionaireService } from '../services/millionaire.service';
import { Public } from 'src/common/decorators';
import { CreateMillionaireQuestionDto } from '../dto/create-millionaire-question.dto';
import { UpdateMillionaireQuestionDto } from '../dto/update-millionaire-question.dto';

@Public()
@Controller('millionaire/questions')
export class MillionaireQuestionController {
  constructor(
    private readonly millionaireService: MillionaireService) {}

  @Post()
  createQuestion(@Body() createMillionaireQuestionDto: CreateMillionaireQuestionDto) {
    return this.millionaireService.createQuestion(createMillionaireQuestionDto);
  }
  @Get(':id')
  findQuestions(@Param('id') id: string) {
    return this.millionaireService.findQuestions(id);
  }

  @Delete(':id')
  removeQuestion(@Param('id') id: string) {
    return this.millionaireService.removeQuestion(id);
  }
  @Patch(':id')
  uptadeQuestion(@Param('id') id: string,@Body() updateMillionaireQuestionDto: UpdateMillionaireQuestionDto) {
    return this.millionaireService.updateQuestion(id,updateMillionaireQuestionDto);
  }
}
