import { Module } from '@nestjs/common';
import { ExperiencesService } from './services/experiences.service';
import { ExperiencesController } from './experiences.controller';
import { Experience } from './entities/experience.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventExperience } from './entities/event-experience.entity';
import { ExperiencePlayData } from './entities/experience-play-data.entity';
import { EventExperienceService } from './services/event-experience.service';
import { EventExperienceController } from './event-experience.controller';
import { EventModule } from 'src/event';
import { ExperiencePlayDataController } from './experience-play-data.controller';
import { ExperiencePlayDataService } from './services/experience-play-data.service';
import { attendeeModule } from 'src/attendee';

@Module({
	imports: [TypeOrmModule.forFeature([Experience, EventExperience, ExperiencePlayData]), EventModule, attendeeModule],
	controllers: [ExperiencesController, EventExperienceController, ExperiencePlayDataController],
	providers: [ExperiencesService, EventExperienceService, ExperiencePlayDataService],
	exports: [ExperiencesService],
})
export class ExperiencesModule {}
