import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';

@Controller('collaborator')
export class CollaboratorController {
  constructor(private readonly colaboratorService: CollaboratorService) {}
  CollaboratorService
  @Post()
  create(@Body() createColaboratorDto: CreateCollaboratorDto) {
    return this.colaboratorService.create(createColaboratorDto);
  }

  @Get()
  findAll() {
    return this.colaboratorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colaboratorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColaboratorDto: UpdateCollaboratorDto) {
    return this.colaboratorService.update(+id, updateColaboratorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colaboratorService.remove(+id);
  }
}
