import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { OrganizationService } from "src/organization/organization.service";
import { UserContext } from "src/types/user.types";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly organizationService: OrganizationService,
  ) {}

  async create(user: UserContext, createEventDto: CreateEventDto) {
    try {
      const org = await this.organizationService.findOne(
        user.id,
        user.organizationId,
      );
      const newEvent = this.eventRepository.create({
        organization: org.organization,
        ...createEventDto,
      });
      return await this.eventRepository.save(newEvent);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(orgId: string) {
    try {
      return await this.eventRepository.find({
        where: {
          organization: {
            id: orgId,
        }
      }
      })
    } catch (error) {
      this.controlDbErros(error);
    }
  }

  async findOne(id: string) {
      const event = await this.eventRepository.findOneBy({id});
        if (!event) {
          throw new BadRequestException("Event not found");
        }
      return {
        event: {
          name: event.name,
          date: event.dates,
          description: event.description,
        },
        organization: {
          id: event?.organization?.id,
          name: event?.organization?.name,
        
        }
      }
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }

  controlDbErros(error: any) {
    if (error.code === "23505") {
      throw new ConflictException("Event name already exists");
    }
    console.log(error);
    throw new BadRequestException("error in event service");
  }
}
