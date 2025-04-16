import { Module } from '@nestjs/common';
import { NetworkingService } from './networking.service';
import { NetworkingController } from './networking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Networking } from './entities/networking.entity';
import { EventService } from 'src/event/event.service';
import { EventModule } from 'src/event/event.module';
import { Event } from 'src/event/entities/event.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Networking, Event]), EventModule],
	controllers: [NetworkingController],
	providers: [NetworkingService, EventService],
})
export class NetworkingModule {}
