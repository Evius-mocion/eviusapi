import { Injectable } from "@nestjs/common";
import { AssistantDto } from "./dto/create-assistant.dto";
import { UpdateAssistantDto } from "./dto/update-assistant.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Assistant } from "./entities/assistant.entity";
import { Repository } from "typeorm";
import { PaginationArgs } from "src/common/dto";

@Injectable()
export class AssistantService {
  constructor(
    @InjectRepository(Assistant)
    private assistantRepository: Repository<Assistant>,
  ) {}

  async create(createAssistantDto: AssistantDto) {
    const assistant = this.assistantRepository.create(createAssistantDto);
    return await this.assistantRepository.save(assistant);
  }

  findAll() {
    return `This action returns all assistant`;
  }
  async getAssistantByEvent(eventId: string, pagination: PaginationArgs) {
    const { offset, limit } = pagination;

    const [assistants,total] = await this.assistantRepository.findAndCount({
      where: {
        event: {
          id: eventId,
        },
      },
      take: limit,
      skip: (offset - 1) * limit,
    });
    
    return { 
      assistants : assistants.map(assistant => ({
        id: assistant.id,
        fullName: assistant.fullName,
        checkIn: assistant.checkIn,
        email: assistant.user.email
      })),
      total
     };
  }
  async getTotalAssistantByEvent(eventId: string) {
    const totalAssistant = await this.assistantRepository.count({
      where: {
        event: {
          id: eventId,
        },
      },
    });
    return { totalAssistant };
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

  

  remove(id: number) {
    return `This action removes a #${id} assistant`;
  }
}
