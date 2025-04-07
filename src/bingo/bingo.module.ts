import { Module } from '@nestjs/common';
import { BingoService } from './bingo.service';
import { BingoController } from './bingo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bingo } from './entities/bingo.entity';
import { BingoCard } from './entities/bingo_card.entity';
import { Ballots } from './entities/ballots.entity';
import { BingoRound } from './entities/bingo_round.entity';
import { Figure } from './entities/figure.entity';
import { Event } from 'src/event/entities/event.entity';
import { Activity } from 'src/activities/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bingo,BingoCard,Ballots,BingoRound,Figure,Event,Activity])],
  controllers: [BingoController],
  providers: [BingoService],
})
export class BingoModule {}
