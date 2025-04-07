import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElementHuntGame } from './entities/element-hunt-game.entity';
import { ElementHuntParticipant } from './entities/element-hunt-participants.entity';
import { ElementHuntSession } from './entities/element-hunt-sessions';
import { ElementHuntGameController } from './element-hunt-game.controller';
import { ElementHuntGameService } from './element-hunt-game.service';
import { EventModule } from './../event/event.module';
import { ElementHuntParticipantController } from './participants.controller';
import { ElementHuntParticipantService } from './element-hunt-participant.service';
import { attendeeModule } from 'src/attendee';

@Module({
	imports: [TypeOrmModule.forFeature([ElementHuntGame, ElementHuntParticipant, ElementHuntSession]), EventModule, attendeeModule],
	controllers: [ElementHuntGameController, ElementHuntParticipantController],
	providers: [ElementHuntGameService, ElementHuntParticipantService],
})
export class ElementHuntGameModule {}
