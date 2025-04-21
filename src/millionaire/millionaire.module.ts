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

@Module({
  imports: [TypeOrmModule.forFeature([Millionaire, MillionaireQuestion, MillionaireOption, MillionaireAnswer]),EventModule],
  controllers: [MillionaireController,MillionaireQuestionController],
  providers: [MillionaireService],
})
export class MillionaireModule {}
