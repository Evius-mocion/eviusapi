import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElementHuntSession } from './entities/element-hunt-sessions.entity';
import { ElementHuntParticipantService } from './element-hunt-participant.service';
import { CreateSessionDto } from './dto/create-session.dto';
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

		if (!elementHunt.isPlaying) throw new ConflictException('Game is not playing');

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
		return { session };
	}

	async recordFault(id: string) {
		const { session } = await this.findOne(id);
		if(session.finished) throw new BadRequestException('Cannot record fault: session has finished')
		if (session.remaining_lives <= 0) {
			throw new BadRequestException('Cannot record fault: participant has no remaining lives');
		}

		session.remaining_lives -= 1;

		if (session.remaining_lives <= 0) {
			session.finished = true;
			session.end_time = new Date();
		}
		return {
			session: await this.sessionRepo.save(session),
		};
	}

	async recordPoint(id: string, pointId: string) {
		const { session } = await this.findOne(id);
		if(session.finished) throw new BadRequestException('Cannot record point: session has finished')
		const pointExists = session.found_points.some((point) => point.id === pointId);

		if (pointExists) {
			throw new BadRequestException('Hidden point has already been found');
		}

		const { participant } = await this.participantService.findOne(session.participantId);
		const hiddenPoint = participant.elementHuntGame.hidden_points.find((point) => point.id === pointId);

		if (!hiddenPoint) {
			throw new NotFoundException('Hidden point not found');
		}

		session.found_points.push(hiddenPoint);

		if (session.found_points.length === participant.elementHuntGame.hidden_points.length) {
			session.finished = true;
			session.end_time = new Date();
		}

		const updatedSession = await this.sessionRepo.save(session);
		return { session: updatedSession };
	}
}
