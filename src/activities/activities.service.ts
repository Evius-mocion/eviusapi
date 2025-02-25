import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/event/entities/event.entity';
import { PaginationArgs } from 'src/common/dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) { }

  async create(createActivityDto: CreateActivityDto, eventId: string) {
    const event = await this.eventRepository.findOne({
      select: ['id'],
      where: { id: eventId, }
    });

    if (!event) throw new NotFoundException('Event not found');

    const newActivity = this.activityRepository.create({
      ...createActivityDto,
      event
    });

    const activity = await this.activityRepository.save(newActivity); 
    
    return { activity }
  }

  async findAll(eventId: string, pagination: PaginationArgs) {
    const { offset, limit } = pagination;
    const activities = await this.activityRepository.find({
      select: ['id', 'name', 'longDescription', 'shortDescription', 'Speaker', 'image', 'imageMobile', 'dates'],
      where: {
        event: {
          id: eventId
        }
      },
      take: limit,
      skip: (offset - 1) * limit,
      cache: true,
    });
    return {
      activities
    }
  }

  async findOne(id: string) {

    const activity = await this.activityRepository.findOneBy({ id });

    if (!activity) throw new NotFoundException('Activity not found');

    return activity;

  }

  async update(id: string, updateActivityDto: Partial<CreateActivityDto>) {

    const activity = await this.activityRepository.findOneBy({ id });

    if (!activity) throw new NotFoundException('Activity not found');

    await this.activityRepository.update(id, updateActivityDto)

    return {
      message: 'Activity updated successfully',
    }

  }

  async remove(id: string) {
    const activity = await this.activityRepository.findOneBy({ id });

    if (!activity) throw new NotFoundException('Activity not found');
    
    await this.activityRepository.delete(id);
    
    return { message: 'Activity deleted successfully' }
  }
}
