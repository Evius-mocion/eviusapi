import { Module } from '@nestjs/common';
import { MillionaireService } from './millionaire.service';
import { MillionaireController } from './millionaire.controller';
import { Millionaire } from './entities/millionaire.entity';
import { MillionaireQuestion } from './entities/millionaire_question.entity';
import { MillionaireOption } from './entities/millionaire_options.entity';
import { MillionaireAnswer } from './entities/millionaire_answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Millionaire, MillionaireQuestion, MillionaireOption, MillionaireAnswer])],
  controllers: [MillionaireController],
  providers: [MillionaireService],
})
export class MillionaireModule {}
