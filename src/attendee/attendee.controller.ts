import { Controller, Get, Patch, Param, Delete, Query, Body, Post, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { FilterAttendeeArgs, PaginationArgs } from 'src/common/dto';
import { Roles } from 'src/constants/constants';
import { WithoutAccount, Role, Public } from 'src/common/decorators';
import { checkInDto } from './dto/check-in.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { Response } from 'express';

@Controller('attendee')
export class AttendeeController {
	constructor(private readonly attendeeService: AttendeeService) {}

	private parseExcel(file: Express.Multer.File) {
		const workbook = XLSX.read(file.buffer, { type: 'buffer' });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		return XLSX.utils.sheet_to_json(sheet, { raw: false }); // 🔹 Devuelve un array de objetos con los datos
	}
	private convertExcel(data: any[]) {
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Attendees');

		return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
	}

	@Get()
	findAll() {
		return this.attendeeService.findAll();
	}

	@WithoutAccount()
	@Get('find/:attendeeId')
	findOne(@Param('attendeeId') attendeeId: string) {
		return this.attendeeService.findOneById(attendeeId);
	}

	@WithoutAccount()
	@Get('find/eventId/:eventId/identify/:email')
	findByEmail(@Param('email') email: string, @Param('eventId') eventId: string) {
		return this.attendeeService.findOneByEmail(eventId, email);
	}

	@Role(Roles.auditor)
	@Get(':orgId/all/:eventId')
	getAssistant(@Query() Filters: FilterAttendeeArgs, @Query() pagination: PaginationArgs, @Param('eventId') eventId: string) {
		return this.attendeeService.getAttendeeByEvent(eventId, pagination, Filters);
	}

	@WithoutAccount()
	@Get('totalCount/:eventId')
	count(@Param('eventId') eventId: string) {
		return this.attendeeService.getTotalAttendeesByEvent(eventId);
	}

	@WithoutAccount()
	@Patch('checkIn/:id')
	update(@Param('id') id: string, @Body() CheckInDto: checkInDto) {
		return this.attendeeService.checkIn(id, CheckInDto);
	}

	@Role(Roles.admin)
	@Post('import/:eventId')
	@UseInterceptors(FileInterceptor('file'))
	importAttendee(@UploadedFile() file: Express.Multer.File, @Param('eventId') eventId: string) {
		const attendees = this.parseExcel(file);
		console.log(attendees);

		return this.attendeeService.registerAttendeesInEvent({
			attendees,
			eventId,
		});
	}

	@Role(Roles.admin)
	@Get('export/:eventId')
	async exportAttendee(@Res() res: Response, @Param('eventId') eventId: string) {
		const attendees = await this.attendeeService.exportAttendees(eventId);
		const buffer = this.convertExcel(attendees);

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=attendees.xlsx');

		// 🔹 Ahora enviamos el buffer en la respuesta correctamente
		res.send(buffer);
	}
	@Role(Roles.auditor)
	@Get('statistics/:eventId')
	async statistics(@Res() res: Response, @Param('eventId') eventId: string) {
		return this.attendeeService.statisticsEvent(eventId);
	}
	
	@Role(Roles.admin)
	@Patch(':id')
	upddateAttendee(@Param('id') id: string, @Body() updateAssistantDto: any) {
		return this.attendeeService.update(id, updateAssistantDto);
	}

	@Role(Roles.admin)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.attendeeService.remove(id);
	}
}
