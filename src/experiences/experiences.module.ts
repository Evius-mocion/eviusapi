import { Module } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { Experience } from './entities/experience.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventExperience } from './entities/event-experience.entity';
import { ExperiencePlayData } from './entities/experience-play-data.entity';
import { EventExperienceService } from './event-experience.service';
import { EventExperienceController } from './event-experience.controller';
import { EventModule } from 'src/event';

@Module({
	imports: [TypeOrmModule.forFeature([Experience, EventExperience, ExperiencePlayData]), EventModule],
	controllers: [ExperiencesController, EventExperienceController],
	providers: [ExperiencesService, EventExperienceService],
	exports: [ExperiencesService],
})
export class ExperiencesModule {}
