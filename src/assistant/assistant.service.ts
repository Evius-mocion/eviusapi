import { Injectable } from '@nestjs/common';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assistant } from './entities/assistant.entity';
import { Repository } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class AssistantService {
  constructor(
    @InjectRepository(Assistant)
    private assistantRepository: Repository<Assistant>,
  ) {}

  create(createAssistantDto: CreateAssistantDto) {
    return "This action adds a new assistant";
  }

  findAll() {
    return `This action returns all assistant`;
  }

  async findOneByUserIdAndEventId(userID: string, event: Event) {
    return await this.assistantRepository.findOneBy({
      user: {
        id: userID,
      },
      event: {
        id: event.id,
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
