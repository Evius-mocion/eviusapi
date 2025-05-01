import { Controller, Post, Body, Param, ParseUUIDPipe, Get } from '@nestjs/common';
import { NetworkingParticipantService } from './networking-participant.service';
import { AssignRoleDto } from './dto/networking-participant.dto';
import { ImportByAttendeeIdsDto } from './dto/networking-participant.dto';

@Controller('networking-participant')
export class NetworkingParticipantController {
	constructor(private readonly participantService: NetworkingParticipantService) {}

	@Post('import/attendee-ids/:networkingId')
	async importByAttendeeIds(@Param('networkingId', new ParseUUIDPipe()) networkingId: string, @Body() body: ImportByAttendeeIdsDto) {
		return this.participantService.importParticipantsByAttendeeIds(networkingId, body.attendeeIds);
	}

	/* @Post('import/emails/:networkingId')
	async importByEmails(@Param('networkingId', new ParseUUIDPipe()) networkingId: string, @Body() body: ImportByEmailsDto) {
		return this.participantService.importByEmails(networkingId, body.emails);
	} */

	@Post('assign-role/:networkingId/:attendeeId')
	async assignRole(
		@Param('networkingId', new ParseUUIDPipe()) networkingId: string,
		@Param('attendeeId', new ParseUUIDPipe()) attendeeId: string,
		@Body() body: AssignRoleDto
	) {
		return this.participantService.assignRoleToParticipant(networkingId, attendeeId, body.role);
	}

	@Get('participants/:networkingId')
	async getParticipants(@Param('networkingId', new ParseUUIDPipe()) networkingId: string) {
		return this.participantService.getParticipantsByAdmissionType(networkingId);
	}
}
