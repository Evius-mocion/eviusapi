import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElementHuntGame } from './entities/element-hunt-game.entity';
import { CreateElementHuntGameDto } from './dto/create-element-hunt-game.dto';
import { UpdateElementHuntGameDto } from './dto/update-element-hunt-game.dto';
import { EventService } from '../event/event.service';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class ElementHuntGameService {
	constructor(
		@InjectRepository(ElementHuntGame)
		private readonly gameRepository: Repository<ElementHuntGame>,
		private readonly eventService: EventService // Add EventService
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
		console.log('updateDto', updateDto);
		await this.gameRepository.update(id, updateDto);
		return this.findOne(id);
	}

	async remove(id: string) {
		const { elementHunt } = await this.findOne(id);
		await this.gameRepository.delete(id);
		return { elementHunt };
	}
}
