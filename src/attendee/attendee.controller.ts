import { Controller, Get, Patch, Param, Delete, Query, Body } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { PaginationArgs } from 'src/common/dto';
import { Roles } from 'src/constants/constants';
import { WithoutAccount, Role } from 'src/common/decorators';
import { checkInDto } from './dto/check-in.dto';

@Controller('attendee')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  

  @Get()
  findAll() {
    return this.attendeeService.findAll();
  }
  
  @WithoutAccount()
  @Get('find/:email')
  findOne(@Param('email') email: string) {
    return this.attendeeService.findOneByEmail(email);
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
    @Param('id') id: string,
    @Body() CheckInDto: checkInDto) {
    return this.attendeeService.checkIn(id,CheckInDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendeeService.remove(+id);
  }
}
