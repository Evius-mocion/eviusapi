import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AssistantDto, CreateMasiveAssistantDto } from './dto/create-assistant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { In, Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dto';
import { CheckInActivity } from './entities/checkIn.entity';
import { checkInDto } from './dto/check-in.dto';
import { Station } from 'src/stations/entities/station.entity';
import { User } from 'src/common/entities';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class AttendeeService {
	constructor(
		@InjectRepository(Attendee)
		private attendeeRepository: Repository<Attendee>,
		@InjectRepository(CheckInActivity)
		private CheckInRepository: Repository<CheckInActivity>,
		@InjectRepository(Station)
		private readonly stationRepository: Repository<Station>,
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
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
			const { date, stationID, type } = checkInData;
			let station = null;

			if (stationID) {
				station = await this.stationRepository.findOneBy({ id: stationID });
				if (!station) throw new NotFoundException();
			}
			const result =await this.attendeeRepository.update(id, {
				checkInAt: date ?? new Date().toString(),
				station: station,
				checkInType: type,
			});
			const { raw } = result;
			const attendee = raw[0];
			return { message: 'check in successfully', attendee };
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
			relations:['user']
		});

		return {
			attendees:attendees.map(attendee=>{
				const {user, ...rest} = attendee;
				return {
					...rest,
					email: user.email
				}
			}),
			total,
		};
	}
	async registerAttendeesInEvent(data: CreateMasiveAssistantDto) {
		const { attendees, eventId } = data
		const erros = [];
		const event = await this.eventRepository.findOneBy({ id: eventId });

		if (!event) throw new NotFoundException('event not found');

		const emails = attendees.map(attendee=>attendee.email);
		const [userRegistered] = await this.userRepository.findAndCount({where: {email: In(emails)}});
		
		const attendeesWithUser = attendees.map((attendee)=>({
			...attendee,
			user: userRegistered.find(user=>user.email === attendee.email)
		}))
		
		const preRegistered = [];
		
		for (const attendee of attendeesWithUser) {
			

			if (!attendee.user) {
				try {
				const newUser = await this.userRepository.save(attendee);
				attendee.user = newUser;
				} catch (error) {
					erros.push(attendee)
				}
			}
			const attendeeCreated = this.attendeeRepository.create({
				...attendee,
				event,
			})
			preRegistered.push(attendeeCreated);
		} 
		
		const resultImport = await this.attendeeRepository.save(preRegistered, {reload: true});
		const result = resultImport.map(attendee=> ({new: attendee.id !== undefined, email: attendee.email}));
		console.log(resultImport);
		
		return { message: 'import successfully', erros , errorsCount: erros.length , successCount: resultImport.length , success: result};
		
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
			userId: userID,
			eventId: event,
		});
	}

	remove(id: number) {
		return `This action removes a #${id} assistant`;
	}
}
