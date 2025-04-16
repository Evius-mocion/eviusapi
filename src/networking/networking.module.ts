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

@Module({
	imports: [TypeOrmModule.forFeature([Networking, NetworkingSpace, Meeting, MeetingParticipant, RequestOfMeeting]), EventModule],
	controllers: [NetworkingController],
	providers: [NetworkingService],
})
export class NetworkingModule {}
