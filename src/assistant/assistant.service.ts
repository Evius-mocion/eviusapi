import { Injectable } from '@nestjs/common';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';

@Injectable()
export class AssistantService {
  create(createAssistantDto: CreateAssistantDto) {
    return 'This action adds a new assistant';
  }

  findAll() {
    return `This action returns all assistant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assistant`;
  }

  update(id: number, updateAssistantDto: UpdateAssistantDto) {
    return `This action updates a #${id} assistant`;
  }

  remove(id: number) {
    return `This action removes a #${id} assistant`;
  }
}
