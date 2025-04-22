import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { MillionaireService } from '../services/millionaire.service';
import { Public } from 'src/common/decorators';
import { CreateMillionaireAnswerDto } from '../dto/create-millionaire-answer.dto';

@Public()
@Controller('millionaire/answers')
export class MillionaireResponseController {
  constructor(
    private readonly millionaireService: MillionaireService) {}
  
  
  @Post()
  createQuestion(@Body() createMillionaireAnswerDto: CreateMillionaireAnswerDto) {
    return this.millionaireService.createAnswer(createMillionaireAnswerDto);
  }

  @Get(':id')
  findQuestions(@Param('id') id: string) {
    return this.millionaireService.findQuestions(id);
  }
  @Get(':id')
  findAllQuestions(@Param('id') id: string) {
    return this.millionaireService.findQuestions(id);
  }

}
