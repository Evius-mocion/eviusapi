import { Module } from '@nestjs/common';
import { NetworkingService } from './networking.service';
import { NetworkingController } from './networking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Networking } from './entities/networking.entity';
import { NetworkingSpace } from './entities/networking-space.entity';
import { Meeting } from './entities/meeting.entity';
import { MeetingParticipant } from './entities/meeting-participant.entity';
import { RequestOfMeeting } from './entities/request-of-meeting.entity';
import { EventModule } from 'src/event/event.module';
import { NetworkingParticipant } from './entities/networking-participant.entity';
import { NetworkingParticipantController } from './networking-participant.controller';
import { NetworkingParticipantService } from './networking-participant.service';
import { attendeeModule } from 'src/attendee';
import { Attendee } from 'src/attendee/entities/attendee.entity';
import { NetworkingAccessControlService } from './networking-access-control.services';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Networking,
			NetworkingSpace,
			Meeting,
			MeetingParticipant,
			RequestOfMeeting,
			NetworkingParticipant,
			Attendee,
		]),
		EventModule,
		attendeeModule,
	],
	controllers: [NetworkingController, NetworkingParticipantController],
	providers: [NetworkingService, NetworkingParticipantService, NetworkingAccessControlService],
})
export class NetworkingModule {}
