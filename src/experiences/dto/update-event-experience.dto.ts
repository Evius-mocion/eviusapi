import { PartialType } from '@nestjs/swagger';
import { CreateEventExperienceDto } from './create-event-experience.dto';
import { Exclude } from 'class-transformer';

export class UpdateEventExperienceDto extends PartialType(CreateEventExperienceDto) {
	@Exclude()
	eventId?: string;
	@Exclude()
	experienceId?: string;
}
