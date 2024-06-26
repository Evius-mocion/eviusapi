import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from 'src/organization/organization.module';
import { AssistantModule } from 'src/assistant/assistant.module';
import { CollaboratorModule } from 'src/collaborator/collaborator.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), OrganizationModule, AssistantModule,CollaboratorModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
