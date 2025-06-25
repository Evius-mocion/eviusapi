import { PartialType } from '@nestjs/swagger';
import { CreateEventSectorDto } from './create-event-sector.dto';

export class UpdateEventSectorDto extends PartialType(CreateEventSectorDto) {}
