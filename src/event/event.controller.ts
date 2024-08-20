import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserContext } from 'src/types/user.types';
import { CreateAssistantDto } from 'src/assistant/dto/create-assistant.dto';
import { Roles } from 'src/constants/constants';
import { UpdateEventDto } from './dto/update-event.dto';
import { SuperAdmin, Role, WithoutAccount, Public, ActiveUser} from 'src/common/decorators';


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


  @Public()
  @Get('landing/:id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @SuperAdmin()
  @Role(Roles.editor)
  @Patch('update/:id/:orgId')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id,updateEventDto);
  }

  
  @Public()
  @Post('register')
  assistants(@Body() assistant: CreateAssistantDto) {
    return this.eventService.register(assistant);
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
  @Get("isAssistant")
  validateAssistants(@Query('email') email: string, @Query('eventId') eventId: string) {
    return this.eventService.confirmedEmailRegisterInEvent(email,eventId);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
