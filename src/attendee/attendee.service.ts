import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AssistantDto } from './dto/create-assistant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dto';
import { CheckIn } from './entities/checkIn.entity';
import { checkInDto } from './dto/check-in.dto';

@Injectable()
export class AttendeeService {
	constructor(
		@InjectRepository(Attendee)
		private attendeeRepository: Repository<Attendee>,
		@InjectRepository(CheckIn)
		private CheckInRepository: Repository<CheckIn>
	) {}

	async create(createAssistantDto: AssistantDto) {
		const attendee = this.attendeeRepository.create(createAssistantDto);
		return await this.attendeeRepository.save(attendee);
	}

	findAll() {
		return `This action returns all assistant`;
	}

	async findOneById(attendeeId: string) {
		const attendee = await this.attendeeRepository.findOne({
			where: {
				id: attendeeId,
			},
			relations: ['checkIn'],
		});
		return { attendee };
	}

	async findOneByEmail(eventId: string, email: string) {
		const attendee = await this.attendeeRepository.findOneBy({
			user: {
				email,
			},
			event: {
				id: eventId,
			},
		});

		return { attendee };
	}
	async checkIn(id: string, checkInData: checkInDto) {
		try {
			const { type, experienceID, stationID } = checkInData;
			const Attendee = await this.attendeeRepository.findOneBy({ id });
			const newCheckIn = this.CheckInRepository.create({
				Attendee,
				type,
				experienceID,
				stationID,
			});
			await this.CheckInRepository.save(newCheckIn);
			return { message: 'check in successfully' };
		} catch (error) {
			throw new InternalServerErrorException('error updating assistant');
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
			attendees: attendees.map((attendee) => ({
				id: attendee.id,
				fullName: attendee.fullName,
				checkIn: attendee.checkIn,
				email: attendee.user.email,
				checkInAt: attendee.checkIn,
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
