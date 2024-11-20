import { Module } from '@nestjs/common';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from './entities/station.entity';
import { EventModule } from 'src/event';
import { ExperiencesModule } from 'src/experiences/experiences.module';

@Module({
	imports: [TypeOrmModule.forFeature([Station]), EventModule, ExperiencesModule],
	controllers: [StationsController],
	providers: [StationsService],
})
export class StationsModule {}
