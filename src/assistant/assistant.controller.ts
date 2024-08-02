import { Controller, Get, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationArgs } from 'src/common/dto';

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

  @Public()
  @Get(':orgId/all/:eventId')
  getAssistant(
    @Query() pagination: PaginationArgs,
    @Param('eventId') eventId: string) {
    return this.assistantService.getAssistantByEvent(eventId,pagination);
  }
  @Get('totalCount/:eventId')
  count(@Param('eventId') eventId: string) {
    return this.assistantService.getTotalAssistantByEvent(eventId);
  }

 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistantService.remove(+id);
  }
}
