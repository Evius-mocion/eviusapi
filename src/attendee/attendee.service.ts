import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AssistantDto } from "./dto/create-assistant.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendee } from "./entities/attendee.entity";
import { Repository } from "typeorm";
import { PaginationArgs } from "src/common/dto";

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
  ) {}

  async create(createAssistantDto: AssistantDto) {
    const attendee = this.attendeeRepository.create(createAssistantDto);
    return await this.attendeeRepository.save(attendee);
  }

  findAll() {
    return `This action returns all assistant`;
  }
  async checkIn(id: string) {
    try {
      await this.attendeeRepository.update(id, { checkIn: true, checkInAt: new Date() });
      return { message: "check in successfully" };
    } catch (error) {
      throw new InternalServerErrorException("error updating assistant");
    }
  }

  async getAttendeeByEvent(eventId: string, pagination: PaginationArgs) {
    const { offset, limit } = pagination;

    const [attendees, total] = await this.attendeeRepository.findAndCount({
      where: {
        event: {
          id: eventId,
        },
      },
      take: limit,
      skip: (offset - 1) * limit,
    });

    return {
      assistants: attendees.map((attendee) => ({
        id: attendee.id,
        fullName: attendee.fullName,
        checkIn: attendee.checkIn,
        email: attendee.user.email,
        checkInAt: attendee.checkInAt,
      })),
      total,
    };
  }
  async getTotalAttendeesByEvent(eventId: string) {
    const totalAttendee = await this.attendeeRepository.count({
      where: {
        event: {
          id: eventId,
        },
      },
    });
    return { totalAttendee };
  }

  async findOneByUserIdAndEventId(userID: string, event: string) {
    return await this.attendeeRepository.findOneBy({
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
