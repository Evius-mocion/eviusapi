import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UserContext } from 'src/types/user.types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public, Role , ActiveUser} from 'src/common/decorators';
import { Roles } from 'src/constants/constants';
import { PaginationArgs, UuidDto } from 'src/common/dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
@ApiTags('organization')
@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  
  @Post('create')
  create(
    @ActiveUser() user: UserContext,
    @Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(user,createOrganizationDto);
  }

  
  
  @HttpCode(HttpStatus.CREATED)
  @Get("register/:invitationId")
  getInvitation(
    @ActiveUser() user: UserContext,
    @Param("invitationId") invitationId: string) {
    return this.organizationService.register(user, invitationId);
  }
  
  @HttpCode(HttpStatus.OK)
  @Get("reject/:invitationId")
  rejectInvitation(
    @Param("invitationId") invitationId: string) {
    return this.organizationService.rejectInvitation( invitationId);
  }

  @Role(Roles.auditor)
  @HttpCode(HttpStatus.CREATED)
  @Get(":orgId/invitations")
  getAll(
    @Query() pagination: PaginationArgs,
    @Param() params: UuidDto,
    @Query('status') status?: string,
  ) {
    return this.organizationService.getInvitations(params.orgId,pagination, status);
  }
  

  @HttpCode(HttpStatus.CREATED)
  @Get('invitations/user')
  invitationsUser(
    @ActiveUser() user: UserContext,
    @Query('status') status?: string,
  ) {
    return this.organizationService.getInvitationsByUser(user, status);
  }
  
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Get("invitation/:id")
  invitation(
    @Param("id") id: string) {
    return this.organizationService.invitationStatus(id);
  }

  @Get('all')
  findAll(@Query('userId') userId: string,) {
    return this.organizationService.findAllByContributorId(userId);
  }

  @Role(Roles.auditor)
  @Get(':orgId')
  findOne(
    @Param('orgId') id: string,
  ) {
    return this.organizationService.findOne(id);
  }

  @Role(Roles.auditor)
  @Get(':orgId/accessToOrganization')
  accessToOrganization(
    @Param('orgId') id: string,
    @ActiveUser() user: UserContext
  ) {
    return this.organizationService.getAccessOrganization(id, user.id);
  }



  @Role('owner')
  @Patch(':orgId')
  update(
    @Param('orgId') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto 
  ) {
    return this.organizationService.update(id,updateOrganizationDto);
  }
  @Role('owner')
  @Delete(':orgId')
  remove(@Param('orgId') id: string) {
    return this.organizationService.remove(id);
  }
}
