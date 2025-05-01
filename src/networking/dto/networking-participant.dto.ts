import { IsEnum, IsArray, IsString } from 'class-validator';
import { NetworkingRole } from '../entities/networking-participant.entity';

export class AssignRoleDto {
	@IsEnum(NetworkingRole)
	role: NetworkingRole;
}

export class ImportByAttendeeIdsDto {
	@IsArray()
	@IsString({ each: true })
	attendeeIds: string[];
}

export class ImportByEmailsDto {
	@IsArray()
	@IsString({ each: true })
	emails: string[];
}
