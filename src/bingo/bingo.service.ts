import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBingoDto } from './dto/create-bingo.dto';
import { UpdateBingoDto } from './dto/update-bingo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bingo } from './entities/bingo.entity';
import { Repository } from 'typeorm';
import { BingoRound } from './entities/bingo_round.entity';
import { BingoCard } from './entities/bingo_card.entity';
import { Ballots } from './entities/ballots.entity';
import { Figure } from './entities/figure.entity';
import { Event } from 'src/event/entities/event.entity';
import { Activity } from 'src/activities/entities/activity.entity';

@Injectable()
export class BingoService {
	constructor(
		@InjectRepository(Event)
		private readonly eventRepository: Repository<Event>,

		@InjectRepository(Activity)
		private readonly activityRepository: Repository<Activity>,

		@InjectRepository(Bingo)
		private readonly bingoRepository: Repository<Bingo>,

		@InjectRepository(BingoRound)
		private readonly bingoRoundRepository: Repository<BingoRound>,

		@InjectRepository(BingoCard)
		private readonly bingoCardRepository: Repository<BingoCard>,

		@InjectRepository(Ballots)
		private readonly ballotsRepository: Repository<Ballots>,

		@InjectRepository(Figure)
		private readonly figureRepository: Repository<Figure>
	) {}

	async create(createBingoDto: CreateBingoDto) {
    const event = await this.eventRepository.findOneBy({id: createBingoDto.eventId })

    if (!event) throw new NotFoundException(`Event with id: ${createBingoDto.eventId} not found`);	
    
  
    /* if (createBingoDto.activityId) {
       activity = event.activities.find(activity => activity.id === createBingoDto.activityId);
       if (!activity) throw new NotFoundException(`Activity with id: ${createBingoDto.activityId} not found`);	
    } */

		const bingo = this.bingoRepository.create({
      event,
      ...createBingoDto,});

		return await this.bingoRepository.save(bingo);
	}

	findAll() {
		return `This action returns all bingo`;
	}

	findOne(id: number) {
		return `This action returns a #${id} bingo`;
	}

	update(id: string, updateBingoDto: UpdateBingoDto) {



		this.bingoRepository.update(id, updateBingoDto);
	}

	remove(id: number) {
		return `This action removes a #${id} bingo`;
	}
}
