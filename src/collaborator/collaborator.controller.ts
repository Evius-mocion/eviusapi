import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CreateCollaboratorDto, UpdateCollaboratorDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserContext } from 'src/types/user.types';
import { Roles } from 'src/constants/constants';
import { ActiveUser, Public, Role } from 'src/common/decorators'; 
import { PaginationArgs, UuidDto } from 'src/common/dto';

@ApiTags('collaborator')
@ApiBearerAuth()
@Controller('collaborator')
export class CollaboratorController {
  constructor(private readonly colaboratorService: CollaboratorService) {}
  
  @Post()
  create(@Body() createColaboratorDto: CreateCollaboratorDto) {
    return this.colaboratorService.create(createColaboratorDto);
  }
  
  @Public()
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

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Get("invitation/:id")
  invitation(
    @Param("id") id: string) {
    return this.colaboratorService.invitationStatus(id);
  }

  @Role(Roles.auditor)
  @HttpCode(HttpStatus.CREATED)
  @Get("invitationsByEvent/:eventId")
  getAll(
    @Query() pagination: PaginationArgs,
    @Param() params: UuidDto,
    @Query('status') status?: string,
  ) {
    return this.colaboratorService.getInvitationsByEvent(params.eventId,pagination, status);
  }

  @HttpCode(HttpStatus.OK)
  @Get("invitation/reject/:id")
  rejectInvitation(
    @Param("id") invitationId: string) {
    return this.colaboratorService.rejectInvitation( invitationId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Get("invitation/register/:id")
  getInvitation(
    @ActiveUser() user: UserContext,
    @Param("id") invitationId: string) {
    return this.colaboratorService.register(user, invitationId);
  }
}
