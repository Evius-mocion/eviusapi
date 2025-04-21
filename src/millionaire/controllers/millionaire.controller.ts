import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MillionaireService } from '../services/millionaire.service';
import { CreateMillionaireDto } from '../dto/create-millionaire.dto';
import { UpdateMillionaireDto } from '../dto/update-millionaire.dto';
import { Public } from 'src/common/decorators';

@Public()
@Controller('millionaire')
export class MillionaireController {
  constructor(
    private readonly millionaireService: MillionaireService) {}

  @Post()
  create(@Body() createMillionaireDto: CreateMillionaireDto) {
    return this.millionaireService.create(createMillionaireDto);
  }

  @Get('all/:eventId')
  findAll(@Param('eventId') id: string) {
    return this.millionaireService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.millionaireService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMillionaireDto: UpdateMillionaireDto) {
    return this.millionaireService.update(id, updateMillionaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.millionaireService.remove(id);
  }
}
