import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMillionaireDto } from '../dto/create-millionaire.dto';
import { UpdateMillionaireDto } from '../dto/update-millionaire.dto';
import { Millionaire } from '../entities/millionaire.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventService } from 'src/event';
import { MillionaireQuestion } from '../entities/millionaire_question.entity';
import { CreateMillionaireQuestionDto } from '../dto/create-millionaire-question.dto';
import { MillionaireOption } from '../entities/millionaire_options.entity';
import { UpdateMillionaireQuestionDto } from '../dto/update-millionaire-question.dto';

@Injectable()
export class MillionaireService {
     constructor(
        @InjectRepository(Millionaire)
        private readonly millionairesRepository: Repository<Millionaire>,
        @InjectRepository(MillionaireQuestion)
        private readonly questionRepository: Repository<MillionaireQuestion>,
        @InjectRepository(MillionaireOption)
        private readonly optionRepository: Repository<MillionaireOption>,
        private readonly eventService: EventService // Inject the EventService to use its dat
     ) {}

    async create(createMillionaireDto: CreateMillionaireDto) {
        const event = await this.eventService.findOneBy(createMillionaireDto.eventId);
        const newMillionaire = this.millionairesRepository.create({
            ...createMillionaireDto,
            event,
        });
        
       const millionaire = await  this.millionairesRepository.save(newMillionaire);

        return millionaire;
    }

    async findAll(eventId: string) {
        return await this.millionairesRepository.find({
            where: {
                event: {
                    id: eventId,
                },
            },
        });
    }

    async findOne(id: string) {
        const millionaire = await this.millionairesRepository.findOne({
            where: {
                id,	
            },
            order: {
                questions: {
                    order: 'ASC'
                }
            }
         });
        if (!millionaire) {
           throw new NotFoundException(`Millionaire with ID ${id} not found`); 
        }
        return millionaire;
    }

    async update(id: string, updateMillionaireDto: UpdateMillionaireDto) {
        const millionaire = await this.findOne(id);
        if (!millionaire) {
            throw new NotFoundException(`Millionaire with ID ${id} not found`);
       }

        Object.assign(millionaire, updateMillionaireDto)

        return await this.millionairesRepository.save(millionaire);
    }

   async remove(id: string) {
      const result = await this.millionairesRepository.delete(id);
      if (!result.affected || result.affected === 0) {
        throw new NotFoundException(`Millionaire with ID ${id} not found`);
      }
      return { message: 'Millionaire deleted successfully' };
    }

async createQuestion(createMillionaireQuestionDto: CreateMillionaireQuestionDto) {

    const millionaire = await this.findOne(createMillionaireQuestionDto.millionaire_id);
	const questions = millionaire.questions;

	// Create and save the new question
	const newQuestion = this.questionRepository.create({
		...createMillionaireQuestionDto,
        millionaire,
		order: questions.length ? questions[questions.length - 1].order + 1 : 1,
	});

	const question = await this.questionRepository.save(newQuestion);

    const newOptions = createMillionaireQuestionDto.options.map(option => {
        return this.optionRepository.create({
            ...option,
            question
        });
    });

    await this.optionRepository.save(newOptions);
	return question;
}

async findQuestions(id: string) {
    return await this.questionRepository.findOne({
        where: {
           id
        }
    });
}

async removeQuestion(id: string) {
    // First find the question to get its millionaire ID
    const questionToDelete = await this.questionRepository.findOne({
        where: { id },
        relations: ['millionaire']
    });

    if (!questionToDelete) {
        throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Get all questions for this millionaire
    const questions = await this.questionRepository.find({
        where: {
            millionaire: {
                id: questionToDelete.millionaire.id
            }
        },
        order: {
            order: 'ASC'
        }
    });

    // Delete the question first
    await this.questionRepository.delete(id);

    // Update the order of remaining questions
    const questionsToUpdate = questions
        .filter(q => q.id !== id && q.order > questionToDelete.order)
        .map(q => ({
            ...q,
            order: q.order - 1
        }));

    // Save all updated questions
    if (questionsToUpdate.length > 0) {
        await this.questionRepository.save(questionsToUpdate);
    }

    return { message: 'Question deleted successfully' };
}



async updateQuestion(id: string, updateMillionaireQuestionDto: UpdateMillionaireQuestionDto) {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question) {
        throw new NotFoundException(`Question with ID ${id} not found`);
    }

    Object.assign(question, updateMillionaireQuestionDto);

    return await this.questionRepository.save(question);
}

}
