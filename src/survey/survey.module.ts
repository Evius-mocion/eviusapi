import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { SurveyAnswer } from './entities/surveyAnswer.entity';
import { Option } from './entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey,Question,Option,SurveyAnswer])],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
