import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Not, Repository } from 'typeorm';
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

    return await this.activityRepository.save(newActivity);
  }

  async findAll(eventId: string, pagination: PaginationArgs) {
    const { offset, limit } = pagination;
    return this.activityRepository.find({
      where: {
        event: {
          id: eventId
        }
      },
      take: limit,
      skip: (offset - 1) * limit,
      cache: true,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
