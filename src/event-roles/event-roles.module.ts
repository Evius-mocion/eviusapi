import { Module } from '@nestjs/common';
import { EventRolesService } from './event-roles.service';
import { EventRolesController } from './event-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { EventRole } from './entities/event-role.entity';
import { Event } from 'src/event/entities/event.entity';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventRole]),
    OrganizationModule,
  ],
  controllers: [EventRolesController],
  providers: [EventRolesService],
})
export class EventRolesModule {}
