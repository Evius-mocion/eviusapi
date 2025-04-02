import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CreateCollaboratorDto, UpdateCollaboratorDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserContext } from 'src/types/user.types';
import { Roles } from 'src/constants/constants';
import { ActiveUser, Role } from 'src/common/decorators'; 

@ApiTags('collaborator')
@ApiBearerAuth()
@Controller('collaborator')
export class CollaboratorController {
  constructor(private readonly colaboratorService: CollaboratorService) {}
  
  @Post()
  create(@Body() createColaboratorDto: CreateCollaboratorDto) {
    return this.colaboratorService.create(createColaboratorDto);
  }
  
  @Get("event/:id")
  findAll(@Param('id') id: string) {
    return this.colaboratorService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colaboratorService.findOneById(id);
  }
  
  @Role(Roles.admin)
  @Patch(':id')
  update(
    @ActiveUser() user: UserContext,
    @Param('id') id: string, 
    @Body() updateColaboratorDto: UpdateCollaboratorDto) {
    return this.colaboratorService.update(id, updateColaboratorDto,user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colaboratorService.remove(+id);
  }
}
