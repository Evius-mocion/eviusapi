import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserContext } from 'src/types/user.types';
import { CreateAssistantDto } from 'src/attendee/dto/create-assistant.dto';
import { Roles } from 'src/constants/constants';
import { UpdateEventDto } from './dto/update-event.dto';
import { SuperAdmin, Role, WithoutAccount, Public, ActiveUser} from 'src/common/decorators';
import { ClientInfo, GetClientInfo } from 'nest-request-ip';


@ApiTags('events')
@ApiBearerAuth()
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Role(Roles.admin)
  @Post("create/:orgId")
  create(
    @ActiveUser() user: UserContext,
    @Body() createEventDto: CreateEventDto) {
    return this.eventService.create(user,createEventDto);
  }

  @Role(Roles.auditor)
  @Get("all/:orgId")
  findAll(
    @Param('orgId') id: string,
  ) {
    return this.eventService.findAll(id);
  }

  @SuperAdmin()
  @Get("admin/all")
  findAllEvents() {
    return this.eventService.findAllEvents();
  }

  @SuperAdmin()
  @Get("admin/:id")
  getOne(@Param('id') id: string) {
    return this.eventService.getOne(id);
  }


  @Public()
  @Get('landing/:id')
  findOne(
    @Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Role(Roles.editor)
  @Patch('update/:id/:orgId')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id,updateEventDto);
  }

  
  @Public()
  @Post('register')
  assistants(
    @GetClientInfo() info: ClientInfo,
    @Body() attendee: CreateAssistantDto) {
    return this.eventService.register(attendee,info);
  }

  @HttpCode(HttpStatus.OK)
  @WithoutAccount()
  @Get("access/:eventId")
  accessEvent(
    @ActiveUser() user: UserContext,
    @Param('eventId') eventID: string) {
    return this.eventService.identifierUser(eventID,user.id);
  }
 
  @Public()
  @Get("isAttendee")
  validateAttendees(@Query('email') email: string, @Query('eventId') eventId: string) {
    return this.eventService.confirmedEmailRegisterInEvent(email,eventId);
  }
  
  @Role(Roles.owner)
  @Delete(':orgId/delete/:eventId')
  remove(
    @Param('eventId') eventId: string
) {
    return this.eventService.remove(eventId);
  }
}
