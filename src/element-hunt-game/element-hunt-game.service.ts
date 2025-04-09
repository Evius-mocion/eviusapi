import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElementHuntGame } from './entities/element-hunt-game.entity';
import { CreateElementHuntGameDto } from './dto/create-element-hunt-game.dto';
import { UpdateElementHuntGameDto } from './dto/update-element-hunt-game.dto';
import { EventService } from '../event/event.service';
import { ConflictException } from '@nestjs/common';
import { HiddenPoints } from './types/hidden-point';
import { v4 as uuid } from 'uuid';
import { CreateHiddenPointDto } from './dto/create-hidden-point';
import { ElementHuntSession } from './entities/element-hunt-sessions.entity';
@Injectable()
export class ElementHuntGameService {
	constructor(
		@InjectRepository(ElementHuntGame)
		private readonly gameRepository: Repository<ElementHuntGame>,
		@InjectRepository(ElementHuntSession)
		private readonly sessionRepository: Repository<ElementHuntSession>,
		private readonly eventService: EventService
	) {}

	async create(createDto: CreateElementHuntGameDto) {
		// Validate event exists
		await this.eventService.findOneBy(createDto.eventId);

		// Check for existing game with this event ID
		const existingGame = await this.gameRepository.findOne({
			where: { event: { id: createDto.eventId } },
		});

		if (existingGame) {
			throw new ConflictException('An Element Hunt game already exists for this event');
		}

		// Proceed with creation
		const game = this.gameRepository.create({
			...createDto,
			event: { id: createDto.eventId },
		});

		return await this.gameRepository.save(game);
	}

	async findOne(id: string) {
		const elementHunt = await this.gameRepository.findOneBy({ id });
		if (!elementHunt) {
			throw new NotFoundException('Element Hunt game not found');
		}
		return { elementHunt };
	}

	async findByEventId(eventId: string) {
		await this.eventService.findOneBy(eventId);
		const elementHunt = await this.gameRepository.findOne({
			where: { event: { id: eventId } },
		});
		return { elementHunt };
	}

	async update(id: string, updateDto: UpdateElementHuntGameDto) {
		await this.findOne(id);

		await this.gameRepository.update(id, updateDto);
		return this.findOne(id);
	}

	async finishAllActiveParticipants(gameId: string) {
		await this.findOne(gameId);

		// Get all participants with their active sessions
		const participantsWithSessions = await this.gameRepository
			.createQueryBuilder('game')
			.leftJoinAndSelect('game.participants', 'participant')
			.leftJoinAndSelect('participant.elementHuntSessions', 'session')
			.where('game.id = :gameId', { gameId })
			.andWhere('session.finished = false')
			.getOne();

		if (!participantsWithSessions?.participants?.length) return;

		// Update all active sessions
		const activeSessions = participantsWithSessions.participants.flatMap((p) => p.elementHuntSessions).filter((s) => !s.finished);

		if (activeSessions.length === 0) return;

		await this.sessionRepository.save(
			activeSessions.map((session) => ({
				...session,
				finished: true,
				end_time: new Date(),
				remaining_lives: 0,
			}))
		);
	}

	async remove(id: string) {
		const { elementHunt } = await this.findOne(id);
		await this.gameRepository.delete(id);
		return { elementHunt };
	}

	async addHiddenPoint(gameId: string, newPoint: CreateHiddenPointDto) {
		const { elementHunt } = await this.findOne(gameId);

		const hasCollision = elementHunt.hidden_points.some(
			(point) => point.x_value === newPoint.x_value && point.y_value === newPoint.y_value
		);

		if (hasCollision) {
			throw new ConflictException('A point already exists at these coordinates');
		}

		const pointWithId: HiddenPoints = {
			id: uuid(),
			...newPoint,
		};

		await this.gameRepository.update(gameId, {
			hidden_points: [...elementHunt.hidden_points, pointWithId],
		});

		return { hiddenPoint: pointWithId };
	}

	async removeHiddenPoint(gameId: string, pointId: string) {
		const { elementHunt } = await this.findOne(gameId);

		const pointIndex = elementHunt.hidden_points.findIndex((point) => point.id === pointId);

		if (pointIndex === -1) {
			throw new NotFoundException('Hidden point not found');
		}

		const updatedPoints = elementHunt.hidden_points.filter((point) => point.id !== pointId);

		await this.gameRepository.update(gameId, {
			hidden_points: updatedPoints,
		});

		return {
			removedPoint: elementHunt.hidden_points[pointIndex],
			remainingPoints: updatedPoints,
		};
	}

	async setGameState(id: string, isPlaying: boolean) {
		const { elementHunt } = await this.findOne(id);
		if (isPlaying) {
			if (elementHunt.hidden_points.length === 0) {
				throw new BadRequestException('Cannot activate game without hidden points');
			}
			await this.gameRepository.update(id, { isPlaying });
			return {
				isPlaying
			}
		}

		// Deactivation logic
		if (elementHunt.isPlaying) {
			await this.finishAllActiveParticipants(id);
		}
		await this.gameRepository.update(id, { isPlaying });
		return {
			isPlaying
		}
	}
}
