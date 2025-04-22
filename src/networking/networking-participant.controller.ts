import { Controller, Post, Body, Param, ParseUUIDPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NetworkingParticipantService } from './networking-participant.service';
import { AssignRoleDto } from './dto/networking-participant.dto';

@Controller('networking-participant')
export class NetworkingParticipantController {
	constructor(private readonly participantService: NetworkingParticipantService) {}

	@Post('import/attendee-ids/:networkingId')
	async importByAttendeeIds(
		@Param('networkingId', new ParseUUIDPipe()) networkingId: string,
		@Body() body: { attendeeIds: string[] }
	) {
		return this.participantService.importByAttendeeIds(networkingId, body.attendeeIds);
	}

	// 2. Import by emails array
	@Post('import/emails/:networkingId')
	async importByEmails(@Param('networkingId', new ParseUUIDPipe()) networkingId: string, @Body() body: { emails: string[] }) {
		return this.participantService.importByEmails(networkingId, body.emails);
	}

	/* @Post('import/excel/:networkingId')
	@UseInterceptors(FileInterceptor('file'))
	async importByExcel(@Param('networkingId', new ParseUUIDPipe()) networkingId: string, @UploadedFile() file: Express.Multer.File) {
		// return this.participantService.importByExcel(networkingId, file);
	} */

	// 4. Assign role to a participant (create if not exists)

	@Post('assign-role/:networkingId/:attendeeId')
	async assignRole(
		@Param('networkingId', new ParseUUIDPipe()) networkingId: string,
		@Param('attendeeId', new ParseUUIDPipe()) attendeeId: string,
		@Body() body: AssignRoleDto
	) {
		return this.participantService.assignRole(networkingId, attendeeId, body.role);
	}
}
