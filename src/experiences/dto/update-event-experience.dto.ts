import { PartialType } from '@nestjs/swagger';
import { CreateEventExperienceDto } from './create-event-experience.dto';

export class UpdateEventExperienceDto extends PartialType(CreateEventExperienceDto) {}