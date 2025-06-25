import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventSectorsService } from './event-sectors.service';
import { CreateEventSectorDto } from './dto/create-event-sector.dto';
import { UpdateEventSectorDto } from './dto/update-event-sector.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';

@ApiTags('event-sectors')
@ApiBearerAuth()
@Controller('event-sectors')
export class EventSectorsController {
  constructor(private readonly eventSectorsService: EventSectorsService) {}

  @Public()
  @Post()
  create(@Body() createEventSectorDto: CreateEventSectorDto) {
    return this.eventSectorsService.create(createEventSectorDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.eventSectorsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.eventSectorsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventSectorDto: UpdateEventSectorDto) {
  //   return this.eventSectorsService.update(+id, updateEventSectorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventSectorsService.remove(+id);
  // }
}
