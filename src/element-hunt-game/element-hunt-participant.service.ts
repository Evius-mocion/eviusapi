import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElementHuntParticipant } from './entities/element-hunt-participants.entity';
import { AttendeeService } from '../attendee/attendee.service';
import { ElementHuntGameService } from './element-hunt-game.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ElementHuntParticipantService {
	constructor(
		@InjectRepository(ElementHuntParticipant)
		private participantRepo: Repository<ElementHuntParticipant>,
		private attendeeService: AttendeeService,
		private gameService: ElementHuntGameService
	) {}

	async findOne(id: string): Promise<{ participant: ElementHuntParticipant }> {
		const participant = await this.participantRepo.findOne({
			where: { id },
			relations: ['attendee', 'elementHuntGame'],
		});

		if (!participant) {
			throw new NotFoundException('Participant not found');
		}

		return { participant };
	}
	async create(createDto: CreateParticipantDto) {
		const [attendeeResponse, gameResponse] = await Promise.all([
			this.attendeeService.findOneById(createDto.attendeeId),
			this.gameService.findOne(createDto.gameId),
		]);

		if (attendeeResponse.attendee.eventId !== gameResponse.elementHunt.eventId) {
			throw new ConflictException("Attendee does not belong to the game's event");
		}

		const existing = await this.participantRepo.findOne({
			where: {
				attendee: { id: createDto.attendeeId },
				elementHuntGame: { id: createDto.gameId },
			},
		});

		if (existing) {
			throw new ConflictException('Participant already registered for this game');
		}

		// Create and save new participant
		const participant = this.participantRepo.create({
			attendee: { id: createDto.attendeeId },
			elementHuntGame: { id: createDto.gameId },
		});
		const elementHunt = await this.participantRepo.save(participant);
		return { elementHunt };
	}

	async findByGame(gameId: string) {
		await this.gameService.findOne(gameId);

		return this.participantRepo.find({
			where: { elementHuntGame: { id: gameId } },
			relations: ['attendee'],
		});
	}

	async findByAttendee(userId: string) {
		return this.participantRepo.find({
			where: { attendee: { id: userId } },
			relations: ['elementHuntGame'],
		});
	}

	async remove(id: string) {
		const participant = await this.participantRepo.findOneBy({ id });
		if (!participant) {
			throw new NotFoundException('Participant not found');
		}
		await this.participantRepo.delete(id);
		return participant;
	}
}
