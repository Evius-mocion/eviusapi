import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Document } from './entities/document';
import { Speaker } from './entities/speaker.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity,Document,Speaker,Event])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
