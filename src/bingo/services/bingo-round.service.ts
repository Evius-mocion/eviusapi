import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bingo } from '../entities/bingo.entity';
import { Repository } from 'typeorm';
import { BingoRound } from '../entities/bingo_round.entity';
import { BingoCard } from '../entities/bingo_card.entity';
import { Figure } from '../entities/figure.entity';
import { FigureType, StatusRoundBingo } from '../interfaces';
import { CreateBingoRoundDto } from '../dto/create-roundd.dto';
import { BINGO_MAX_BALLOTS } from '../constants';

@Injectable()
export class BingoRoundService {
	constructor(
		@InjectRepository(Bingo)
		private readonly bingoRepository: Repository<Bingo>,

		@InjectRepository(BingoRound)
		private readonly bingoRoundRepository: Repository<BingoRound>,

		@InjectRepository(BingoCard)
		private readonly bingoCardRepository: Repository<BingoCard>,

		@InjectRepository(Figure)
		private readonly figureRepository: Repository<Figure>
	) {}

async create(createBingoDto: CreateBingoRoundDto) {
    const { figureId, bingoId } = createBingoDto;

    // Fetch bingo and active round in parallel
    const [bingo, existRoundActive] = await Promise.all([
        this.bingoRepository.findOneBy({ id: bingoId }),
        this.bingoRoundRepository.findOneBy({
            status: StatusRoundBingo.active,
            bingo: { id: bingoId }
        })
    ]);

    if (!bingo) {
        throw new NotFoundException(`Bingo with id ${bingoId} not found`);
    }

    if (existRoundActive) {
        throw new BadRequestException(`Bingo with id ${bingoId} already has a round active`);
    }

    // Fetch figure after validating bingo
    const figure = await this.figureRepository.findOneBy({ id: figureId });

    if (!figure) {
        throw new NotFoundException(`Figure with id ${figureId} not found`);
    }

    const now = new Date();
    const bingoRound = this.bingoRoundRepository.create({
        figure,
        bingo,
        status: StatusRoundBingo.active,
        created_at: now,
        updated_at: now,
        ballots: this.generateBallots()
    });

    return this.bingoRoundRepository.save(bingoRound);
}

private generateBallots(): number[] {
        const numbers = Array.from({ length: BINGO_MAX_BALLOTS }, (_, i) => i + 1);
        
        // Fisher-Yates shuffle algorithm
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        return numbers;
    }

async getActiveRound(bingoId: string) {
    
    const activeRound = await this.bingoRoundRepository.findOne({
        where: {
           bingo: { id: bingoId },
            status: StatusRoundBingo.active
        },
    });
    return activeRound ?? "";
}

async getRoundById(roundId: string) {
    const round = await this.bingoRoundRepository.findOne({
        where: { id: roundId },
    });

    if (!round) {
        throw new NotFoundException(`Round with id ${roundId} not found`);
    }

    return "xdd";
}
async findOne(id: string) {
    const round = await this.bingoRoundRepository.findOne({
        where: { id },
        relations: ['figure']
    });

    if (!round) {
        throw new NotFoundException(`Round with id ${id} not found`);
    }

    return round;
}

async remove(id: string) {
    const round = await this.findOne(id);
    
    await this.bingoRoundRepository.remove(round);
    
    return {
        message: `Round with id ${id} has been deleted`,
        id
    };
}
async validateCard(cardId: string, cardCode: string, roundId: string) {
    const round = await this.findOne(roundId);
    
    const attendeeCard = await this.bingoCardRepository.findOne({
        where: { id: cardId, code: cardCode },
        relations: ['bingo']
    });

    if (!attendeeCard) {
        throw new NotFoundException('Card not found or invalid code');
    }

    // Get played numbers from the round
    const playedNumbers = round.ballots;

    // Check if all required numbers in the card have been played
    const cardNumbers = attendeeCard.values;
    let isValid = false;

    if (round.figure.type === FigureType.full) {
        // For full card bingo, all numbers must be played
        isValid = cardNumbers.every(number => playedNumbers.includes(number));
    } else {
        // For specific figure, check only the numbers in the figure pattern
        const figurePattern = round.figure.positions;
        const matchingPositions = figurePattern.map((position, index) => {
            if (position === 1) {
                return playedNumbers.includes(cardNumbers[index]);
            }
            return true;
        });
        
        isValid = matchingPositions.every(match => match === true);
    }

    return {
        isValid,
        card: attendeeCard,
        round: round.id,
        figure: round.figure
    };
}

}