import { Controller, Get, Patch, Param, Delete, Query } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { PaginationArgs } from 'src/common/dto';
import { Roles } from 'src/constants/constants';
import { WithoutAccount, Role } from 'src/common/decorators';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  

  @Get()
  findAll() {
    return this.assistantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return "this.assistantService.findOne(+id);"
  }

  @Role(Roles.auditor)
  @Get(':orgId/all/:eventId')
  getAssistant(
    @Query() pagination: PaginationArgs,
    @Param('eventId') eventId: string) {
    return this.assistantService.getAssistantByEvent(eventId,pagination);
  }

  @WithoutAccount()
  @Get('totalCount/:eventId')
  count(@Param('eventId') eventId: string) {
    return this.assistantService.getTotalAssistantByEvent(eventId);
  }
  @WithoutAccount()
  @Patch('checkIn/:id')
  update(
    @Param('id') id: string) {
    return this.assistantService.checkIn(id);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistantService.remove(+id);
  }
}
