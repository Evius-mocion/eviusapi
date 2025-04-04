import { Module } from '@nestjs/common';
import { ElementHuntGameService } from './element-hunt-game.service';
import { ElementHuntGameController } from './element-hunt-game.controller';

@Module({
  controllers: [ElementHuntGameController],
  providers: [ElementHuntGameService],
})
export class ElementHuntGameModule {}
