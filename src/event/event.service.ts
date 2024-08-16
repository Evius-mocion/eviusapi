import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { OrganizationService } from "src/organization/organization.service";
import { UserContext } from "src/types/user.types";
import { CollaboratorService } from "src/collaborator";
import { AssistantService } from "src/assistant/assistant.service";
import { CreateAssistantDto } from "src/assistant/dto/create-assistant.dto";
import { User } from "src/common/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { validateEmail } from "../common/utils/validations.util";
import { UpdateEventDto } from "./dto/update-event.dto";
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
      const org = await this.organizationService.findOne( user.organizationId );
      const newEvent = this.eventRepository.create({
        organization: org.organization,
        initialDate: createEventDto.dates[0]?.startDate,
        finishDate:
          createEventDto.dates[createEventDto.dates.length - 1]?.endDate,
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
          },
        },
      });
    } catch (error) {
      this.controlDbErros(error);
    }
  }
  async findAllEvents() {
    try {
      return await this.eventRepository.find();
    } catch (error) {
      this.controlDbErros(error);
    }
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOneBy({ id });
    const { totalAssistant }  = await this.assistantService.getTotalAssistantByEvent(id)
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
        eventSection: event.eventSection,
        appearance: event.appearance,
        capacity: 20,
        registrationFields: [],
      },
      totalAssistant,
      organization: {
        id: event?.organization?.id,
        name: event?.organization?.name,
      },
    };
  }

  async confirmedEmailRegisterInEvent(email: string, eventId: string) {
    if (!validateEmail(email)) {
      throw new BadRequestException("Invalid email");
    }

    const user = await this.userRepository.findOneBy({ email });

    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new BadRequestException("Event not found");
    }

    let assistant = null;
    let collaborator = null;
    if (user) {
      assistant = await this.assistantService.findOneByUserIdAndEventId(
        user.id,
        event.id,
      );
      collaborator =
        await this.collaboratorService.findOneByIdAndOrganizationId(
          user.id,
          event.organization.id,
        );
    }

    return {
      haveAccount: !!user?.id,
      havePassword: !!user?.password,
      isRegisteredInEvent: !!collaborator || !!assistant?.id,
    };
  }

  async identifierUser(eventId: string, userId: string) {
    let collaboratorRol = null;

    const event = await this.eventRepository.findOneBy({ id: eventId });
    const { totalAssistant }  = await this.assistantService.getTotalAssistantByEvent(eventId)

    if (!event) {
      throw new NotFoundException("Event not found");
    }
    const assistant = await this.assistantService.findOneByUserIdAndEventId(
      userId,
      event.id,
    );
    const collaborator =
      await this.collaboratorService.findOneByIdAndOrganizationId(
        userId,
        event?.organization?.id,
      );

    if (collaborator) {
      collaboratorRol = collaborator.rol;
    }
    const isRegister = !!assistant?.user
    if(assistant){
      delete assistant.event
      delete assistant.user
    }
    return {
      event: {
        id: event.id,
        name: event.name,
        dates: event.dates,
        description: event.description,
        finishDate: event.finishDate,
        initialDate: event.initialDate,
        eventSection: event.eventSection,
        appearance: event.appearance,
        capacity: event.capacity,
        registrationFields: [],
      },
      totalAssistant,
      isRegister,
      rol: collaboratorRol,
      assistant,
      organization: {
        id: event.organization.id,
        name: event.organization.name,
      },
    };
  }

  async register(registerDto: CreateAssistantDto) {
    let newAccount = false;

    const event = await this.eventRepository.findOneBy({
      id: registerDto.eventId,
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }
    const { totalAssistant } =
      await this.assistantService.getTotalAssistantByEvent(registerDto.eventId);

    if (totalAssistant >= event.capacity) {
      throw new ForbiddenException("Event Capacity is full");
    }

    let user = await this.userRepository.findOneBy({
      email: registerDto.email,
    });

    if (!user) {
      user = this.userRepository.create({
        ...registerDto,
        type_account: "assistant",
      });
      user = await this.userRepository.save(user);
      newAccount = true;
    }

    if (!newAccount) {
      const exist = await this.assistantService.findOneByUserIdAndEventId(
        user.id,
        event.id,
      );
      if (exist) throw new ConflictException("Assistant already registered");
    }

    await this.assistantService.create({
      user,
      fullName: registerDto.fullName,
      event,
    });

    const access_token = this.jwtService.sign({
      id: user.id,
      type: user.type_account,
    });

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
        type_account: user.type_account,
      },
    };
  }

  async update(id: string, data : UpdateEventDto) {
    if(Object.keys(data).length === 0){
      throw new BadRequestException("No data to update");
    }

   try {
    const event = await this.eventRepository.update(id, { ...data});
     return {
      message : `Event updated successfully`,
     }
   } catch (error) {
      throw new BadRequestException("error updating event");
   }
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
