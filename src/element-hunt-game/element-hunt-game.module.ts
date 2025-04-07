import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElementHuntGame } from './entities/element-hunt-game.entity';
import { ElementHuntParticipant } from './entities/element-hunt-participants.entity';
import { ElementHuntSession } from './entities/element-hunt-sessions';
import { ElementHuntGameController } from './element-hunt-game.controller';
import { ElementHuntGameService } from './element-hunt-game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ElementHuntGame,
      ElementHuntParticipant,
      ElementHuntSession
    ])
  ],
  controllers: [ElementHuntGameController],
  providers: [ElementHuntGameService],
})
export class ElementHuntGameModule {}
