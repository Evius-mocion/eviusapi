import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserContext } from 'src/types/user.types';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateAssistantDto } from 'src/assistant/dto/create-assistant.dto';


@ApiTags('events')
@ApiBearerAuth()
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post("create")
  create(
    @ActiveUser() user: UserContext,
    @Body() createEventDto: CreateEventDto) {
    return this.eventService.create(user,createEventDto);
  }

  @Get("all/:org")
  findAll(
    @Param('org') id: string,
  ) {
    return this.eventService.findAll(id);
  }


  @Public()
  @Get('landing/:id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, /* @Body() updateEventDto: UpdateEventDto */) {
    return this.eventService.update(+id);
  }

  
  @Public()
  @Post('register')
  assistants(@Body() assistant: CreateAssistantDto) {
    return this.eventService.register(assistant);
  }

  @HttpCode(HttpStatus.OK)
  @Get("access/:eventId")
  accessEvent(
    @ActiveUser() user: UserContext,
    @Param('eventId') eventID: string) {
    return this.eventService.identifierUser(eventID,user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
