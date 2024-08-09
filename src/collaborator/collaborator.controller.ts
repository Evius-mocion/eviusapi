import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserContext } from 'src/types/user.types';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/constants/constants';

@ApiTags('collaborator')
@ApiBearerAuth()
@Controller('collaborator')
export class CollaboratorController {
  constructor(private readonly colaboratorService: CollaboratorService) {}
  CollaboratorService
  @Post()
  create(@Body() createColaboratorDto: CreateCollaboratorDto) {
    return this.colaboratorService.create(createColaboratorDto);
  }
  
  @Get("organization/:id")
  findAll(@Param('id') id: string) {
    return this.colaboratorService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colaboratorService.findOneById(id);
  }
  
  @Role(Roles.admin)
  @Patch(':orgaId/:id')
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
