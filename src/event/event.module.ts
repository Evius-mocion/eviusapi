import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from 'src/organization/organization.module';
import { AssistantModule } from 'src/assistant';
import { CollaboratorModule } from 'src/collaborator';
import { accessCode, Accounts, RecoveryCode, User } from 'src/common/entities';
import { ExperiencesModule } from 'src/experiences/experiences.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User,RecoveryCode,accessCode,Accounts]),
    OrganizationModule,
    AssistantModule,
    CollaboratorModule,
    ExperiencesModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule { }
