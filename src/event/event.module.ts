import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), OrganizationModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
