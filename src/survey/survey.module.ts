import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { SurveyAnswerService } from './survey-answer.service';
import { SurveyAnswer } from './entities/surveyAnswer.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { QuestionService } from './question.service';
import { OptionService } from './option.service';
import { SurveyAnswerController } from './survey-answer.controller';
import { Option } from './entities/option.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Survey, Question, Option, SurveyAnswer, Event, Activity, Attendee])],
	controllers: [SurveyController, SurveyAnswerController],
	providers: [SurveyService, QuestionService, OptionService, SurveyAnswerService],
})
export class SurveyModule {}
