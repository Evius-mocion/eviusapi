import { Controller } from '@nestjs/common';
import { EventExperienceService } from './event-experience.service';

@Controller('event-experience')
export class EventExperienceController {
	constructor(private readonly eventExperienceService: EventExperienceService) {}
}
