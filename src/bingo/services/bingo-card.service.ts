import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bingo } from '../entities/bingo.entity';
import { Repository } from 'typeorm';
import { BingoCard } from '../entities/bingo_card.entity';
import { Event } from 'src/event/entities/event.entity';
import { CardDto } from '../dto/card.dto';
import { Attendee } from 'src/attendee/entities/attendee.entity';
import { BINGO_CARD_SIZE, BINGO_MAX_BALLOTS } from '../constants';
import { PaginationArgs } from 'src/common/dto';

@Injectable()
export class BingoCardService {
	constructor(
		@InjectRepository(Event)
		private readonly eventRepository: Repository<Event>,

		@InjectRepository(Bingo)
		private readonly bingoRepository: Repository<Bingo>,

		@InjectRepository(BingoCard)
		private readonly bingoCardRepository: Repository<BingoCard>,
	) {}





async generateCards( options: CardDto) {
    const {amount, withAttendee, bingoId } = options;
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
