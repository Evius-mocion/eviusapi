import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bingo } from '../entities/bingo.entity';
import { Repository } from 'typeorm';
import { BingoRound } from '../entities/bingo_round.entity';
import { BingoCard } from '../entities/bingo_card.entity';
import { Figure } from '../entities/figure.entity';
import { StatusRoundBingo } from '../interfaces';
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
    
    console.log(activeRound);
    

    return activeRound ?? "";
}

}