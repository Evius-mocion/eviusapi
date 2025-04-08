import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElementHuntSession } from './entities/element-hunt-sessions.entity';
import { ElementHuntParticipantService } from './element-hunt-participant.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ElementHuntGameService } from './element-hunt-game.service';

@Injectable()
export class ElementHuntSessionService {
	constructor(
		@InjectRepository(ElementHuntSession)
		private sessionRepo: Repository<ElementHuntSession>,
		private participantService: ElementHuntParticipantService,
		private elementHuntGameService: ElementHuntGameService
	) {}

	async create(createDto: CreateSessionDto) {
		const { participant } = await this.participantService.findOne(createDto.participantId);

		const { elementHunt } = await this.elementHuntGameService.findOne(participant.elementHuntGameId);

		const existingSession = await this.sessionRepo.findOne({
			where: {
				participant: { id: createDto.participantId },
				finished: false,
			},
		});

		if (existingSession) {
			throw new BadRequestException('Cannot create new session: participant has an unfinished session');
		}

		const session = this.sessionRepo.create({
			participant: { id: createDto.participantId },
			remaining_lives: elementHunt.max_lives,
		});
		const elementHuntSession = await this.sessionRepo.save(session);
		return { elementHuntSession };
	}

	async findOne(id: string) {
		const session = await this.sessionRepo.findOne({
			where: { id },
			relations: ['participant'],
		});

		if (!session) throw new NotFoundException('Session not found');
		return session;
	}

	async update(id: string, updateDto: UpdateSessionDto) {
		await this.sessionRepo.update(id, updateDto);
		return this.findOne(id);
	}

	async remove(id: string) {
		const session = await this.findOne(id);
		await this.sessionRepo.delete(id);
		return session;
	}
}
