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
import { CreateAssistantDto } from "src/assistant/dto/create-assistant.dto";
import { User } from "src/common/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly organizationService: OrganizationService,
    private readonly collaboratorService: CollaboratorService,
    private readonly assistantService: AssistantService,
    private readonly jwtService: JwtService,
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
          id: event.id,
          name: event.name,
          dates: event.dates,
          description: event.description,
          finishDate: event.finishDate,
          initialDate: event.initialDate,
          sections: event.eventSection,
          appearance: event.appearance, 
        },
        organization: {
          id: event?.organization?.id,
          name: event?.organization?.name,
        },
      };
  }
  async identifierUser(eventId: string, userId: string) {
    let collaboratorRol = null
    
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    
    const assistant = await this.assistantService.findOneByUserIdAndEventId(userId,event.id)
    const collaborator = await this.collaboratorService.findOneByIdAndOrganizationId(userId,event?.organization?.id);
   
    if (collaborator) {
      collaboratorRol = collaborator.rol;
    }
    
    return {
      event: {
        id: event.id,
        name: event.name,
        dates: event.dates,
        description: event.description,
        finishDate: event.finishDate,
        initialDate: event.initialDate,
        sections: event.eventSection,
        appearance: event.appearance,
      },
      isRegister: !!assistant?.user,
      rol: collaboratorRol,
      organization: {
        id: event.organization.id,
        name: event.organization.name,
      },
    };
  }

  async register(registerDto: CreateAssistantDto) {
    let newAccount = false;

    const event = await this.eventRepository.findOneBy({ id: registerDto.eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    let user = await this.userRepository.findOneBy({ email: registerDto.email });
    if (!user) {
      user =  this.userRepository.create({
        ...registerDto,
        type_account: 'assistant',
      });
      user = await this.userRepository.save(user);
      newAccount = true;
    }

    if (!newAccount) {
      const exist = await this.assistantService.findOneByUserIdAndEventId(user.id, event.id)
      if (exist) throw new ConflictException('Assistant already registered');
    }

    const assistant = await this.assistantService.create({
      user,
      fullName: registerDto.fullName,
      event,
    });

    const access_token = this.jwtService.sign({ id: user.id });
    return {
      access_token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        birthDate: user.birthDate,
        residenceCountry: user.residenceCountry,
        gender: user.gender,
      },
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
