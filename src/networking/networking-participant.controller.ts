import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { NetworkingParticipantService } from './networking-participant.service';
import { AssignRoleDto } from './dto/networking-participant.dto';
import { ImportByAttendeeIdsDto, ImportByEmailsDto } from './dto/networking-participant.dto';

@Controller('networking-participant')
export class NetworkingParticipantController {
	constructor(private readonly participantService: NetworkingParticipantService) {}

	@Post('import/attendee-ids/:networkingId')
	async importByAttendeeIds(@Param('networkingId', new ParseUUIDPipe()) networkingId: string, @Body() body: ImportByAttendeeIdsDto) {
		return this.participantService.importByAttendeeIds(networkingId, body.attendeeIds);
	}

	@Post('import/emails/:networkingId')
	async importByEmails(@Param('networkingId', new ParseUUIDPipe()) networkingId: string, @Body() body: ImportByEmailsDto) {
		return this.participantService.importByEmails(networkingId, body.emails);
	}

	@Post('assign-role/:networkingId/:attendeeId')
	async assignRole(
		@Param('networkingId', new ParseUUIDPipe()) networkingId: string,
		@Param('attendeeId', new ParseUUIDPipe()) attendeeId: string,
		@Body() body: AssignRoleDto
	) {
		return this.participantService.assignRole(networkingId, attendeeId, body.role);
	}
}
