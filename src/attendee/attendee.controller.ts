import { Controller, Get, Patch, Param, Delete, Query } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { PaginationArgs } from 'src/common/dto';
import { Roles } from 'src/constants/constants';
import { WithoutAccount, Role } from 'src/common/decorators';

@Controller('attendee')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  

  @Get()
  findAll() {
    return this.attendeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return "this.AttendeeService.findOne(+id);"
  }

  @Role(Roles.auditor)
  @Get(':orgId/all/:eventId')
  getAssistant(
    @Query() pagination: PaginationArgs,
    @Param('eventId') eventId: string) {
    return this.attendeeService.getAttendeeByEvent(eventId,pagination);
  }

  @WithoutAccount()
  @Get('totalCount/:eventId')
  count(@Param('eventId') eventId: string) {
    return this.attendeeService.getTotalAttendeesByEvent(eventId);
  }
  @WithoutAccount()
  @Patch('checkIn/:id')
  update(
    @Param('id') id: string) {
    return this.attendeeService.checkIn(id);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendeeService.remove(+id);
  }
}
