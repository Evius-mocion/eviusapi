import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from 'src/organization/organization.module';
import { attendeeModule } from 'src/attendee';
import { CollaboratorModule } from 'src/collaborator';
import { accessCode, Accounts, RecoveryCode, User } from 'src/common/entities';
import { ExperiencesModule } from 'src/experiences/experiences.module';
import { Categories } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User,RecoveryCode,accessCode,Accounts,Categories]),
    OrganizationModule,
    attendeeModule,
    CollaboratorModule,
    ExperiencesModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule { }
