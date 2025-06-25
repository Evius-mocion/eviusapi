import { Injectable } from '@nestjs/common';
import { CreateEventCategoryDto } from './dto/create-event-category.dto';
import { UpdateEventCategoryDto } from './dto/update-event-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventCategory } from './entities/event-category.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class EventCategoriesService {
  constructor(
    @InjectRepository(EventCategory)
    private eventCategoryRepository: Repository<EventCategory>,
  ) {}

  create(createEventCategoryDto: CreateEventCategoryDto) {
    return this.eventCategoryRepository.save(createEventCategoryDto);
  }

  findAll() {
    return this.eventCategoryRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} eventCategory`;
  }

  update(id: number, updateEventCategoryDto: UpdateEventCategoryDto) {
    return `This action updates a #${id} eventCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventCategory`;
  }
}
