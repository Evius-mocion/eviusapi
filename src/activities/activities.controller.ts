import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Role, WithoutAccount } from 'src/common/decorators';
import { Roles } from 'src/constants/constants';
import { PaginationArgs } from 'src/common/dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Role(Roles.admin)
  @Post(':orgId/create/:eventId')
  create(@Body() createActivityDto: CreateActivityDto,@Param('eventId') eventId: string) {
    return this.activitiesService.create(createActivityDto,eventId);
  }

  @WithoutAccount()
  @Get('all/:eventId')
  findAll(
          @Param('id') eventId: string,
          @Query() pagination: PaginationArgs) {
    return this.activitiesService.findAll(eventId,pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.update(+id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(+id);
  }
}
