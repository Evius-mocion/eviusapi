import { Module } from '@nestjs/common';
import { BingoService } from './services/bingo.service';
import { BingoController } from './controllers/bingo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bingo } from './entities/bingo.entity';
import { BingoCard } from './entities/bingo_card.entity';
import { BingoRound } from './entities/bingo_round.entity';
import { Figure } from './entities/figure.entity';
import { Event } from 'src/event/entities/event.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { BingoCardService } from './services/bingo-card.service';
import { BingoCardController } from './controllers/bingo-card.controller';
import { BingoRoundService } from './services/bingo-round.service';
import { BingoRoundController } from './controllers/bingo-round.controller';
import { BingoRoundGateway } from './gateways/bingo-round.gateway';
import { BingoHistory } from './entities/bingo_history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bingo,BingoCard,BingoRound,Figure,Event,Activity,BingoHistory])],
  controllers: [BingoController,BingoCardController,BingoRoundController],
  providers: [BingoService,BingoCardService,BingoRoundService,BingoRoundGateway],
})
export class BingoModule {}
