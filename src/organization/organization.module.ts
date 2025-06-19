import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { User } from 'src/common/entities';
import { Event } from 'src/event/entities/event.entity';
import { Collaborator } from 'src/collaborator/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Organization,User, Event, Collaborator])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
