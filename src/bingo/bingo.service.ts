import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { CardDto } from './dto/card.dto';
import { Attendee } from 'src/attendee/entities/attendee.entity';
import { BINGO_CARD_SIZE, BINGO_MAX_BALLOTS } from './constants';
import { PaginationArgs } from 'src/common/dto';

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

		const bingo = this.bingoRepository.create({
      event,
      ...createBingoDto,});

		return await this.bingoRepository.save(bingo);
	}

async findAll() {
    const bingos = await this.bingoRepository.find({
        order: {
            created_at: 'DESC'
        }
    });

    return bingos;
}

async findOne(id: string) {
    const bingo = await this.bingoRepository.findOne({
        where: { id },
        relations: ['ballots']
    });

    if (!bingo) {
        throw new NotFoundException(`Bingo with id: ${id} not found`);
    }

    return bingo;
}

async update(id: string, updateBingoDto: UpdateBingoDto) {
    // Validate event update attempt
    if (updateBingoDto.eventId) {
        throw new BadRequestException('Event updates are not allowed');
    }

    // Check if activity exists only if activityId is provided
    let activity = null;
    if (updateBingoDto.activityId) {
        activity = await this.activityRepository.findOneBy({ id: updateBingoDto.activityId });
        if (!activity) {
            throw new NotFoundException(`Activity with id: ${updateBingoDto.activityId} not found`);
        }
    }

    // Prepare update data
    const updateData = activity 
        ? { ...updateBingoDto, activity }
        : updateBingoDto;

    // Perform update and get result
    const result = await this.bingoRepository.update(id, updateData);

    // Return appropriate response based on update result
    return {
        message: result.affected 
            ? `Bingo with id: ${id} updated`
            : `Bingo with id: ${id} not found`
    };
}
async remove(id: string) {
    // Find the bingo to delete
    const bingo = await this.bingoRepository.findOneBy({ id });
    
    if (!bingo) {
        throw new NotFoundException(`Bingo with id: ${id} not found`);
    }

    // Delete the bingo and get result
    const result = await this.bingoRepository.delete(id);

    // Return success message
    return {
        message: `Bingo with id: ${id} has been deleted`,
        affected: result.affected
    };
}

async generateBallots(id: string, amount: number) {
  const bingo = await this.bingoRepository.findOneBy({id});
  if (!bingo) {
    throw new NotFoundException(`Bingo with id: ${id} not found`);
  }

  // Generate x amount(75 default) ballots (standard bingo)
  const ballots = Array.from({ length: amount ?? 75 }, (_, i) => (this.ballotsRepository.create({
    value: i + 1,
    bingo: bingo,
    played: true,
  })));

  return this.ballotsRepository.save(ballots);
}


async generateCards(bingoId: string, options: CardDto) {
    const {amount, withAttendee } = options;
    let cardAmount = amount;
    
    // Find bingo with eager loading of event relationship
    const bingo = await this.bingoRepository.findOne({
        where: { id: bingoId },
        relations: ['event']
    });
    
    if (!bingo) throw new NotFoundException('Bingo not found');

    let attendees: Attendee[] = [];
    
    // Handle attendee-based card generation
    if (withAttendee) {
        const event = await this.eventRepository.findOne({
            where: { id: bingo.event.id },
            relations: ['attendees']
        });

        if (!event?.attendees?.length) {
            throw new NotFoundException('No attendees found');
        }

        cardAmount = event.attendees.length;
        attendees = event.attendees;
    }

    // Batch create cards
    const cards = Array.from({ length: cardAmount }, (_, i) => 
        this.bingoCardRepository.create({
            bingo,
            values: this.generateBingoCardNumbers(BINGO_MAX_BALLOTS),
            is_active: true,
            attendee: attendees[i] || null,
            code: this.generateUniqueCode()
        })
    );

    // Batch save all cards
    const bingo_cards = await this.bingoCardRepository.save(cards);
    return { message: `${bingo_cards.length} Cards generated successfully` };
}
private generateBingoCardNumbers(maxNumBallots: number ) {
    const numbers = this.generateRandomUniqueNumbers(1, maxNumBallots, BINGO_CARD_SIZE);
    
    return numbers;
}

private generateRandomUniqueNumbers(min: number, max: number, count: number) {
    const numbers = [];
    while (numbers.length < count) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers;
}

private generateUniqueCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    
    return code;
}

async getOneCard(cardId: string,) {
    const card = await this.bingoCardRepository.findOneBy({id: cardId});

    if (!card) {
        throw new NotFoundException(`card with id: ${cardId} not found`);
    }

    return card;
}

async getAllCards(bingoId: string, options: PaginationArgs) {
    const { offset, limit } = options;
    const skip = (offset - 1) * limit;

    const [cards, total] = await this.bingoCardRepository.findAndCount({
        where: {
            bingo: { id: bingoId },
        },
        select: ['id', 'is_active', 'attendee', 'code', 'created_at'],
        relations: ['attendee'],
        skip,
        take: limit,
        order: {
            created_at: 'DESC'
        },
        cache: true
    });

    return {
        cards,
        total,
    };
}

async deleteAllCards(bingoId: string) {
    const bingo = await this.bingoRepository.findOne({
        where: { id: bingoId }
    });

    if (!bingo) {
        throw new NotFoundException(`Bingo with id: ${bingoId} not found`);
    }

    const result = await this.bingoCardRepository.delete({
        bingo: { id: bingoId }
    });

    return {
        message: `All cards for bingo ${bingoId} have been deleted`,
        affected: result.affected
    };
}

async changeStatusCard(cardId: string, newStatus: boolean = true) {
    const result = await this.bingoCardRepository.update(cardId, {
        is_active: newStatus
    });

    if (result.affected === 0) {
        throw new NotFoundException(`Card with id: ${cardId} not found`);	
    }

    return {
        message: `Card with id: ${cardId} updated`
    };
}



}
