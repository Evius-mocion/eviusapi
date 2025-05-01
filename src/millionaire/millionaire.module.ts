import { Module } from '@nestjs/common';
import { MillionaireService } from './services/millionaire.service';
import { MillionaireController } from './controllers/millionaire.controller';
import { Millionaire } from './entities/millionaire.entity';
import { MillionaireQuestion } from './entities/millionaire_question.entity';
import { MillionaireOption } from './entities/millionaire_options.entity';
import { MillionaireAnswer } from './entities/millionaire_answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from 'src/event';
import { MillionaireQuestionController } from './controllers/question.controller';
import { attendeeModule } from 'src/attendee';
import { MillionaireRanking } from './entities/millionaire_ranking.entity';
import { MillionaireResponseController } from './controllers/answer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Millionaire, MillionaireQuestion, MillionaireOption, MillionaireAnswer, 
    MillionaireRanking
  ]),EventModule,attendeeModule],
  controllers: [MillionaireController,MillionaireQuestionController,MillionaireResponseController],
  providers: [MillionaireService],
})
export class MillionaireModule {}
