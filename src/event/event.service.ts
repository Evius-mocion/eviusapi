import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { OrganizationService } from "src/organization/organization.service";
import { UserContext } from "src/types/user.types";
import { CollaboratorService } from "src/collaborator/collaborator.service";
import { AssistantService } from "src/assistant/assistant.service";
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly organizationService: OrganizationService,
    private readonly collaboratorService: CollaboratorService,
    private readonly assistantService: AssistantService,
  ) {}

  async create(user: UserContext, createEventDto: CreateEventDto) {
    try {
      const org = await this.organizationService.findOne(
        user.id,
        user.organizationId,
      );
      const newEvent = this.eventRepository.create({
        organization: org.organization,
        initialDate: createEventDto.dates[0]?.startDate,
        finishDate: createEventDto.dates[createEventDto.dates.length - 1]?.endDate,
        ...createEventDto,
      });
      return await this.eventRepository.save(newEvent);
    } catch (error) {
      console.log(error);
      
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
  async identifierUser(eventId: string, userId: string) {
    let collaboratorRol = null
    
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    
    const assistant = await this.assistantService.findOneByUserIdAndEventId(userId,event)
    const collaborator = await this.collaboratorService.findOneByIdAndOrganizationId(userId,event?.organization?.id);
   
    if (collaborator) {
      collaboratorRol = collaborator.rol;
    }
    
    return {
      event: {
        name: event.name,
        dates: event.dates,
        description: event.description,
        initialDate : event.initialDate,
        sections : event.eventSection,
        appearance: event.appearance,
        organization: {
          id: event.organization.id,
          name: event.organization.name,
        },
      },
      isRegister: !!assistant?.user,
      rol: collaboratorRol,
    };
  }

  update(id: number) {
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
