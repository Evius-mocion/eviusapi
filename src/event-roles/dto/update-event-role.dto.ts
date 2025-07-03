import { PartialType } from '@nestjs/swagger';
import { CreateEventRoleDto } from './create-event-role.dto';

export class UpdateEventRoleDto extends PartialType(CreateEventRoleDto) {}
