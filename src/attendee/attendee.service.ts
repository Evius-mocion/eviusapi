import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AssistantDto, CreateMasiveAssistantDto } from './dto/create-assistant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { FindOptionsOrder, FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { FilterAttendeeArgs, PaginationArgs } from 'src/common/dto';
import { CheckInActivity } from './entities/checkIn.entity';
import { checkInDto } from './dto/check-in.dto';
import { Station } from 'src/stations/entities/station.entity';
import { User } from 'src/common/entities';
import { Event } from 'src/event/entities/event.entity';
import { validateAttendeesData } from 'src/common/utils/validations.util';

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
			relations: ['user'],
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

	async getAttendeeByEvent(eventId: string, pagination: PaginationArgs, Filter: Partial<FilterAttendeeArgs>) {
		const { offset, limit } = pagination;
		const {where,order} = this.filterAttendee(Filter);

		const [attendees, total] = await this.attendeeRepository.findAndCount({
			where: {
				eventId,
				...where
			},
			select: ['id', 'fullName', 'email', 'checkInAt', 'checkInType', 'country', 'city', 'plataform', 'browser'],
			take: limit,
			skip: (offset - 1) * limit,
			cache: true,
			order,
		});

		return {
			attendees,
			total,
		};
	}

	
	async exportAttendees(eventId: string) {
		const attendees = await this.attendeeRepository.find({
			where: {
				eventId,
			}
		});
		return attendees.map(attendee=>({
			name: attendee.fullName,
			email: attendee.email,
			country: attendee.country ?? '',
			city: attendee.city ?? '',
			plataform: attendee.plataform ?? '',
			browser: attendee.browser ?? '',
			checkInAt: attendee.checkInAt ?? '',
			checkInType: attendee.checkInType ?? '',
		}));
	}
	
	async registerAttendeesInEvent(data: CreateMasiveAssistantDto) {
		const { attendees, eventId } = data
		const errors = [];

		const event = await this.eventRepository.findOneBy({ id: eventId });
		
		if (!event) throw new NotFoundException('event not found');

		const emails = attendees.map(attendee=>attendee.email);
		const userRegistered = await this.userRepository.find({where: {email: In(emails)}});
		
		const attendeesWithUser = attendees.map((attendee)=>({
			...attendee,
			user: userRegistered.find(user=>user.email === attendee.email)
		}))
		
		const preRegistered = [];
		
		for (const attendee of attendeesWithUser) {
			const validation  = validateAttendeesData(attendee,event.registrationFields);

			if (!validation.isValid) {
				errors.push({fullName:attendee.fullName, email: attendee.email + '', errors: validation.errors});
				continue;
			}

			if (!attendee.user) {
				try {
				const newUser = await this.userRepository.save(attendee);
				attendee.user = newUser;
				} catch (error) {
					errors.push({email: attendee.email, errors: [ 'error creating user']});
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

		return { message: 'import successfully', errors , errorsCount: errors.length , successCount: resultImport.length , success: result};
		
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

	async update(id: string, updateAssistantDto: Partial<AssistantDto>) {
		await this.attendeeRepository.update({ id }, updateAssistantDto);
		const attendee = await this.attendeeRepository.findOneBy({ id });
		if (!attendee) {
			throw new NotFoundException(`Attendee with ID ${id} not found`);
		}
		return { message: 'assistant updated successfully', attendee };
	}

	remove(id: number) {
		return `This action removes a #${id} assistant`;
	}
	
	filterAttendee(Filter: Partial<FilterAttendeeArgs>) {
		const where: FindOptionsWhere<Attendee> = {};
		const order: FindOptionsOrder<Attendee> = {};
		if(Filter.orderBy && Filter.order) order[Filter.orderBy] = Filter.order ?? 'ASC';

		if(Filter.email) where.email =  Like(`%${Filter.email}%`);
		if(Filter.fullName) where.fullName =  Like(`%${Filter.fullName}%`);
		if(Filter.checkInType) where.checkInType = Filter.checkInType;
		if(Filter.checkInAt) where.checkInAt =  Like(`%${Filter.checkInAt}%`);
		return {
			where,
			order,
		};
	}
}
