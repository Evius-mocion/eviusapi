import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './entities/option.entity';
import { QuestionService } from './question.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    private readonly questionService: QuestionService,
  ) {}

  async createOption(createOptionDto: CreateOptionDto): Promise<{ option: Option }> {
    const { questionId, ...optionData } = createOptionDto;
    
    const question = await this.questionService.getQuestionById(questionId);
    if (!question.question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    const newOption = this.optionRepository.create({
      ...optionData,
      question: { id: questionId },
    });

    const option = await this.optionRepository.save(newOption);
    return { option };
  }

  async getOptionsByQuestionId(questionId: string): Promise<{ options: Option[] }> {
    await this.questionService.getQuestionById(questionId);
    const options = await this.optionRepository.find({
      where: { question: { id: questionId } },
    });
    return { options };
  }

  async getOptionById(id: string): Promise<{ option: Option }> {
    const option = await this.optionRepository.findOne({ 
      where: { id },
      relations: ['question'],
    });
    
    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }
    return { option };
  }

  async updateOption(id: string, updateDto: UpdateOptionDto): Promise<{ option: Option }> {
    const { option } = await this.getOptionById(id);
    const updated = this.optionRepository.merge(option, updateDto);
    return { option: await this.optionRepository.save(updated) };
  }

  async deleteOption(id: string): Promise<{ option: Option }> {
    const { option } = await this.getOptionById(id);
    await this.optionRepository.remove(option);
    return { option };
  }
}