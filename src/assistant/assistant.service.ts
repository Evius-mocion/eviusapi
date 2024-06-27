import {  Injectable } from '@nestjs/common';
import { AssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assistant } from './entities/assistant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssistantService {
  constructor(
    @InjectRepository(Assistant)
    private assistantRepository: Repository<Assistant>
  ) {}

  async create(createAssistantDto: AssistantDto) {
    const assistant =  this.assistantRepository.create(createAssistantDto);
    return await this.assistantRepository.save(assistant);
  }
  findAll() {
    return `This action returns all assistant`;
  }

  async findOneByUserIdAndEventId(userID: string, event: string) {
    return await this.assistantRepository.findOneBy({
      user: {
        id: userID,
      },
      event: {
        id: event,
      },
    });
  }



  update(id: number, updateAssistantDto: UpdateAssistantDto) {
    return `This action updates a #${id} assistant`;
  }

  remove(id: number) {
    return `This action removes a #${id} assistant`;
  }
}
