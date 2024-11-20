import { Module } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeController } from './attendee.controller';
import { Attendee } from './entities/attendee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities';
import { CheckInActivity } from './entities/checkIn.entity';
import { StationsService } from 'src/stations/stations.service';

@Module({
	imports: [TypeOrmModule.forFeature([Attendee, User, CheckInActivity]), StationsService],
	controllers: [AttendeeController],
	providers: [AttendeeService],
	exports: [AttendeeService],
})
export class attendeeModule {}
