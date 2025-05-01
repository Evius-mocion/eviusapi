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
import { CreateMillionaireAnswerDto } from '../dto/create-millionaire-answer.dto';
import { AttendeeService } from 'src/attendee';
import { MillionaireRanking } from '../entities/millionaire_ranking.entity';
import { MillionaireAnswer } from '../entities/millionaire_answer.entity';

@Injectable()
export class MillionaireService {
     constructor(
        @InjectRepository(Millionaire)
        private readonly millionairesRepository: Repository<Millionaire>,
        @InjectRepository(MillionaireQuestion)
        private readonly questionRepository: Repository<MillionaireQuestion>,
        @InjectRepository(MillionaireOption)
        private readonly optionRepository: Repository<MillionaireOption>,
        @InjectRepository(MillionaireAnswer)
        private readonly answerRepository: Repository<MillionaireAnswer>,
        @InjectRepository(MillionaireRanking)
        private readonly rankingRepository: Repository<MillionaireRanking>,

        private readonly eventService: EventService, // Inject the EventService to use its dat
        private readonly attendeeService: AttendeeService // Inject the EventService to use its dat
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
            select: {
                id: true,
                name: true,
                status: true,
                background_color: true,
                text_color: true,
                logo: true,
                rules: true,
                created_at: true,
                questions: {
                    options: {
                        id: true,
                        text: true,
                    }
                }
            },
            where: {
                id,	
            },
            order: {
                questions: {
                    stage: 'ASC',
                }
            },
            relations: {
                questions: {
                    options: true,
                }
            },
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
    const { millionaire_id, ...questionDto } = createMillionaireQuestionDto;
    const questions = await this.questionRepository.find({
        where: {
            millionaire: {
                id: millionaire_id
            }
        },
    });


	// Create and save the new question
	const newQuestion = this.questionRepository.create({
		...questionDto,
        millionaire: { id: millionaire_id},
		stage: questions.length ? questions[questions.length - 1].stage + 1 : 1,
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
        },
        select: {
            id: true,
            text: true,
            stage: true,
            check_point: true,
            points: true,
            options: true,
        },
        relations: {
            options: true
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
            stage: 'ASC'
        }
    });

    // Delete the question first
    await this.questionRepository.delete(id);

    // Update the order of remaining questions
    const questionsToUpdate = questions
        .filter(q => q.id !== id && q.stage > questionToDelete.stage)
        .map(q => ({
            ...q,
            order: q.stage - 1
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

async createAnswer(answerMillionaireDto: CreateMillionaireAnswerDto) {
    const { question_id, attendee_id, option_id, millonare_id } = answerMillionaireDto;

    const  rankingAttendee = await this.rankingRepository.findOne({
            where: {
                attendee: { id: attendee_id },
                millionaire: { id: millonare_id }
            }
        })

    const question = await this.questionRepository.findOne({
        where: { id: question_id, millionaire: { id: millonare_id } },
        relations: ['options']
    });

    if (!question) {
        throw new NotFoundException(`Question with ID ${question_id} not found`);
    }

    const option = question.options.find(opt => opt.id === option_id);
    if (!option) {
        throw new NotFoundException(`Option with ID ${option_id} not found`);
    }

    const currentRanking = rankingAttendee || this.rankingRepository.create({
        attendee: {id: attendee_id},
        millionaire: { id: millonare_id }, // no necesitas toda la entidad aquí
        points: 0,
        finished: false,
        final_points: 0
    });

    if (option.is_correct) {
        currentRanking.points += question.points;
        if (question.check_point) {
            currentRanking.final_points += question.points;
        }
    } else {
        currentRanking.finished = true;
    }

    const answer = this.answerRepository.create({
        question,
        is_correct: option.is_correct,
        selected_option: { id: option_id},
        attendee: { id: attendee_id },
    });

    await Promise.all([
        this.answerRepository.save(answer),
        this.rankingRepository.save(currentRanking),
    ]);

    return {
        message: option.is_correct ? 'Correct answer!' : 'Incorrect answer!',
        is_correct: option.is_correct,
        finished: !option.is_correct
    };
}


}
