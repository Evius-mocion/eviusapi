import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserContext } from 'src/types/user.types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';

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


  @Get('all')
  findAll(@Query('userId') userId: string,) {
    return this.organizationService.findAllByContributorId(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @ActiveUser() user: UserContext
  ) {
    return this.organizationService.findOne(user.id,id);
  }

  @Role('owner')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
