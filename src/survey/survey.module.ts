import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { SurveyAnswer } from './entities/surveyAnswer.entity';
import { Option } from './entities/option.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { Event } from 'src/event/entities/event.entity';
import { QuestionService } from './question.service';

@Module({
	imports: [TypeOrmModule.forFeature([Survey, Question, Option, SurveyAnswer, Event, Activity])],
	controllers: [SurveyController],
	providers: [SurveyService, QuestionService],
})
export class SurveyModule {}
