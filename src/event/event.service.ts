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
import { AttendeeService } from "src/attendee/attendee.service";
import { CreateAssistantDto } from "src/attendee/dto/create-assistant.dto";
import { User } from "src/common/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { validateEmail } from "../common/utils/validations.util";
import { UpdateEventDto } from "./dto/update-event.dto";
import { ExperiencesService } from "src/experiences/experiences.service";
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly organizationService: OrganizationService,
    private readonly collaboratorService: CollaboratorService,
    private readonly experiencisService: ExperiencesService,
    private readonly attendeeService: AttendeeService,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: UserContext, createEventDto: CreateEventDto) {
    try {
      const org = await this.organizationService.findOne(user.organizationId);
      const experiences = await this.experiencisService.findByIds(
        createEventDto.experiencesId,
      );
      const newEvent = this.eventRepository.create({
        createdBy: user,
        organization: org.organization,
        initialDate: new Date(createEventDto.dates[0]?.startDate),
        finishDate:
          new Date(createEventDto.dates[createEventDto.dates.length - 1]?.endDate),
        experiences: experiences,
        price: 0,
        ...createEventDto,
      });
      return await this.eventRepository.save(newEvent);
    } catch (error) {
      console.log(error);

      throw new BadRequestException(error.message);
    }
  }
  async findOneBy(id: string) {
    return this.eventRepository.findOneBy({ id });
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
      const events = await this.eventRepository.find();
      events.forEach(async (event) => {
        delete event.createdBy.password;
        delete event.createdBy.type_account;
        delete event.createdBy.rol;
      });
      return events;
    } catch (error) {
      this.controlDbErros(error);
    }
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOneBy({ id });
    const { totalAttendee } =
      await this.attendeeService.getTotalAttendeesByEvent(id);
    if (!event) {
      throw new BadRequestException("Event not found");
    }
    const { stations, price, attendees, experiences, ...restOfEvent } = event;
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
    const event = await this.eventRepository.findOneBy({ id });
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

    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new BadRequestException("Event not found");
    }

    let attendee = null;
    let collaborator = null;
    if (user) {
      attendee = await this.attendeeService.findOneByUserIdAndEventId(
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
      isRegisteredInEvent: !!collaborator || !!attendee?.id,
      isCollaborator: !!collaborator,
    };
  }

  async identifierUser(eventId: string, userId: string) {
    let collaboratorRol = null;

    const event = await this.eventRepository.findOneBy({ id: eventId });
    const { totalAttendee } =
      await this.attendeeService.getTotalAttendeesByEvent(eventId);

    if (!event) {
      throw new NotFoundException("Event not found");
    }
    const attendee = await this.attendeeService.findOneByUserIdAndEventId(
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
    const isRegister = !!attendee?.user;
    if (attendee) {
      delete attendee.event;
      delete attendee.user;
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
      totalAttendee,
      isRegister,
      rol: collaboratorRol,
      attendee,
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

    const { totalAttendee } =
      await this.attendeeService.getTotalAttendeesByEvent(registerDto.eventId);

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

    await this.attendeeService.create({
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

  async update(id: string, data: UpdateEventDto) {
    if (Object.keys(data).length === 0) {
      throw new BadRequestException("No data to update");
    }
    try {
      const { experiencesId, ...othersFields } = data;
      const event = await this.eventRepository.findOne({
        where: { id },
        relations: ["experiences"],
      });
      if (!event) {
        throw new NotFoundException("Event not found");
      }

    

      const newEvent = {
        ...event,
        ...othersFields,
      };

      if (Array.isArray(experiencesId)) {
				const experiencias = await this.experiencisService.findByIds(experiencesId);

				newEvent.experiences = experiencias;
			}

      if(data.dates){
        newEvent.initialDate = new Date(data.dates[0]?.startDate);
        newEvent.finishDate = new Date(data.dates[data.dates.length - 1]?.endDate);
      }

      return await this.eventRepository.save(newEvent);
    } catch (error) {
      console.log(error);
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
