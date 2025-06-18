import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Not, Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { OrganizationService } from "src/organization/organization.service";
import { UserContext } from "src/types/user.types";
import { AttendeeService } from "src/attendee/attendee.service";
import { CreateAssistantDto } from "src/attendee/dto/create-assistant.dto";
import { User } from "src/common/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { validateEmail } from "../common/utils/validations.util";
import { UpdateEventDto } from "./dto/update-event.dto";
import { ClientInfo } from "nest-request-ip"
import { startOfMonth, subMonths, endOfMonth, endOfDay, startOfDay, addMonths } from "date-fns";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly organizationService: OrganizationService,
    private readonly attendeeService: AttendeeService,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: UserContext, orgId: string, createEventDto: CreateEventDto) {
    try {
      const org = await this.organizationService.findOne(orgId);
      const newEvent = this.eventRepository.create({
        createdBy: user,
        organization: org.organization,
        initialDate: new Date(createEventDto.dates[0]?.startDate),
        finishDate:
          new Date(createEventDto.dates[createEventDto.dates.length - 1]?.endDate),
        price: 0,
        organizationAlias:org.organization.name,
        ...createEventDto,
      });
      return await this.eventRepository.save(newEvent);
    } catch (error) {
      console.log(error);

      throw new BadRequestException(error.message);
    }
  }
  

  
  async findOneBy(id: string) {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async findAll(orgId: string) {
    try {
      return await this.eventRepository.find({
        where: {
          organization: {
            id: orgId,
          },
        },
        select: ["id", "name", "dates", "initialDate", "capacity","organizationAlias"],
        cache: true,
      });
    } catch (error) {
      this.controlDbErros(error);
    }
  }
  async findAllEvents() {
    try {
      const events = await this.eventRepository.find({
        select: [
          "id",
          "name",
          "dates",
          "initialDate",
          "capacity",
          "organizationAlias",
          "appearance",
          "createdBy",
          "createAt",
          "landingSections",
          "landingDescription"
        ],
        relations: ["createdBy"], // Incluir la relación con User
        cache: true,
      });
      return events;
    } catch (error) {
      this.controlDbErros(error);
    }
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: [
        "organization",
      ],
      loadRelationIds: {
        relations: ["attendees"],
      },
      cache: true,
    });
    if (!event) {
      throw new BadRequestException("Event not found");
    }
    const totalAttendee  = event.attendees.length;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { attendees, ...restOfEvent } = event;
    return {
      event: {
        ...restOfEvent,
      },
      totalAttendee,
      organization: {
        id: event?.organization?.id,
        name: event?.organization?.name,
      },
    };
  }
  async getOne(id: string) {
    const event = await this.eventRepository.findOne({  where:{
      id
    },
    relations:['stations']});
    const { totalAttendee } =
      await this.attendeeService.getTotalAttendeesByEvent(id);
    if (!event) {
      throw new BadRequestException("Event not found");
    }

    return {
      event,
      totalAttendee,
    };
  }

  async confirmedEmailRegisterInEvent(email: string, eventId: string) {
    if (!validateEmail(email)) {
      throw new BadRequestException("Invalid email");
    }

    const user = await this.userRepository.findOneBy({ email });

    const event = await this.eventRepository.findOne({where: { id: eventId }, relations: ["organization","collaborators"], loadRelationIds: {relations: ["attendees"]}});
    if (!event) {
      throw new BadRequestException("Event not found");
    }
 
    
    let attendee = null;
    let collaborator = null;
    if (user) {
      attendee = event.attendees.find((attendee) => attendee.id === user.id);
      collaborator = event.collaborators.find((collaborator) => collaborator.user.id === user.id);
    }

    return {
      haveAccount: !!user?.id,
      havePassword: !!user?.password,
      isRegisteredInEvent: !!collaborator || !!attendee?.id,
      isCollaborator: !!collaborator,
    };
  }

  async identifierUser(eventId: string, userId: string) {
    let collaboratorRol = null;

    const event = await this.eventRepository.findOne({
      where: { id: eventId }, 
      relations: ["organization","collaborators"], 
      cache: true,
    });
  
    
    if (!event) {
      throw new NotFoundException("Event not found");
    }
    
    const attendee = await this.attendeeService.findOneByUserIdAndEventId(
      userId,
      event.id,
    );

    const  collaborator = event.collaborators.find((collaborator) => collaborator.user.id === userId);
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
        eventSection: event.eventSection,
        appearance: event.appearance,
        capacity: event.capacity,
        organizationAlias: event.organizationAlias,
        registrationFields: event.registrationFields,
        landingSections: event.landingSections,
        landingDescription: event.landingDescription,
      },
      isRegister: !!attendee,
      rol: collaboratorRol,
      attendee,
      organization: {
        id: event.organization.id,
        name: event.organization.name,
      },
    };
  }

  async register(registerDto: CreateAssistantDto, data: ClientInfo) {
    let newAccount = false;

    const event = await this.eventRepository.findOne({
     where: { id: registerDto.eventId },
      loadRelationIds: {
        relations: ["attendees"],
      },
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    const  totalAttendee  = event.attendees.length;

    let user = await this.userRepository.findOneBy({
      email: registerDto.email,
    });

    if (!user) {
      user = this.userRepository.create({
        ...registerDto,
        type_account: "attendee",
      });
      user = await this.userRepository.save(user);
      newAccount = true;
    }

    if (!newAccount) {
      const exist = await this.attendeeService.findOneByUserIdAndEventId(
        user.id,
        event.id,
      );
      if (exist) throw new ConflictException("Assistant already registered");
    }

    if (totalAttendee >= event.capacity) {
      throw new ForbiddenException("Event Capacity is full");
    }

    const attendee = await this.attendeeService.create({
      user,
      origin: registerDto.origin,
      fullName: user.fullName,
      email: user.email,
      event,
      city : data.ipInfo.city,
      country: data.ipInfo.country,
      browser: data.browser,
      plataform : data.os,
      properties: registerDto.attendeeData,

    });

    const access_token = this.jwtService.sign({
      id: user.id,
      type: user.type_account,
    });

    return {
      access_token,
      attendee: {
        id: attendee.id,
        fullName: attendee.fullName,
        email: attendee.email,
        checkInAt: attendee.checkInAt,
        checkInType: attendee.checkInType,
      },
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

  async update(id: string, data: UpdateEventDto) {
    if (Object.keys(data).length === 0) {
      throw new BadRequestException("No data to update");
    }
    const event = await this.eventRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    try {
      const updatedEvent = {
        ...event,
        ...data,
        updatedAt: new Date(),
      };

      if(data.dates){
        updatedEvent.initialDate = new Date(data.dates[0]?.startDate);
        updatedEvent.finishDate = new Date(data.dates[data.dates.length - 1]?.endDate);
      }

      await this.eventRepository.update(id, updatedEvent);

      return updatedEvent;
    } catch (error) {
      console.log(error);
      throw new BadRequestException("error updating event");
    }
  }

 async remove(id: string) {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException("Event not found");
    }
    await this.eventRepository.delete(id);
    
    return { message: "Event deleted" };
  }

  controlDbErros(error: any) {
    if (error.code === "23505") {
      throw new ConflictException("Event name already exists");
    }
    console.log(error);
    throw new BadRequestException("error in event service");
  }

  async getStats() {
    const now = new Date();
    
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    const events = await this.eventRepository.find({
      where: {
        createAt: Between(startOfCurrentMonth, endOfCurrentMonth),
      },
    });

    const lastMonthCount = await this.eventRepository.count({
      where: {
        createAt: Between(startOfLastMonth, endOfLastMonth),
      },
    });

    const totalEvents = await this.eventRepository.count();

    const eventsInProcess = await events.filter((event) => event.state === 'in_process').length;
    const eventsExecuted = await events.filter((event) => event.state === 'executed').length;
    const eventsCanceled = await events.filter((event) => event.state === 'canceled').length;

    return {
      totalEvents,
      currentMonthCount: events.length,
      lastMonthCount,
      eventsInProcess,
      eventsExecuted,
      eventsCanceled,
    }
  }

  async getLastUpdated() {
    const events = await this.eventRepository.find({
      order: {
        updatedAt: "DESC",
      },
      take: 5,
    });
    return events;
  }

  async getInProcess() {
    const events = await this.eventRepository.find({
      where: {
        state: "in_process",
      },
    });
    return events;
  }

  async getUpcoming() {
    const today = startOfDay(new Date());
    const oneMonthFromNow = endOfDay(addMonths(new Date(), 1));
  
    const events = await this.eventRepository.find({
      where: {
        initialDate: Between(today, oneMonthFromNow),
        state: Not("in_process"),
      },
    });
  
    return events;
  }
}
