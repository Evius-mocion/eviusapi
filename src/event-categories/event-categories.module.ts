import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { EventCategoriesService } from './event-categories.service';
import { EventCategoriesController } from './event-categories.controller';
import { Event } from 'src/event/entities/event.entity';
import { EventCategory } from './entities/event-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventCategory]),
  ],
  controllers: [EventCategoriesController],
  providers: [EventCategoriesService],
})
export class EventCategoriesModule {}
