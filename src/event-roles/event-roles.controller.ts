import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventRolesService } from './event-roles.service';
import { CreateEventRoleDto } from './dto/create-event-role.dto';
import { UpdateEventRoleDto } from './dto/update-event-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { ActiveOrgGuard } from 'src/common/guards/activeOrg.guard';

@ApiTags('event-roles')
@ApiBearerAuth()
@Controller('event-roles')
export class EventRolesController {
  constructor(private readonly eventRolesService: EventRolesService) {}

  @Post('events/:eventId')
  // @UseGuards(ActiveOrgGuard)
  create(
    @Param('eventId') eventId: string,
    @Body() createEventRoleDto: CreateEventRoleDto
  ) {
    return this.eventRolesService.create(eventId, createEventRoleDto);
  }

  @Get('events/:eventId')
  findAll(@Param('eventId') eventId: string) {
    return this.eventRolesService.findAll(eventId);
  }

  @Get('events/:eventId/:eventRoleId')
  findOne(@Param('eventRoleId') eventRoleId: string) {
    return this.eventRolesService.findOne(eventRoleId);
  }

  @Patch('events/:eventId/:eventRoleId')
  // @UseGuards(ActiveOrgGuard)
  update(@Param('eventRoleId') eventRoleId: string, @Body() updateEventRoleDto: UpdateEventRoleDto) {
    return this.eventRolesService.update(eventRoleId, updateEventRoleDto);
  }

  @Delete('events/:eventId/:eventRoleId')
  // @UseGuards(ActiveOrgGuard)
  remove(@Param('eventRoleId') eventRoleId: string) {
    return this.eventRolesService.remove(eventRoleId);
  }
}
