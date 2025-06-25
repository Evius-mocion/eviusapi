import { Injectable } from '@nestjs/common';
import { CreateEventSectorDto } from './dto/create-event-sector.dto';
import { UpdateEventSectorDto } from './dto/update-event-sector.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventSector } from './entities/event-sector.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class EventSectorsService {
  constructor(
    @InjectRepository(EventSector)
    private eventSectorsRepository: Repository<EventSector>,
  ) {}

  create(createEventSectorDto: CreateEventSectorDto) {
    return this.eventSectorsRepository.save(createEventSectorDto);
  }

  findAll() {
    return this.eventSectorsRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} eventSector`;
  }

  update(id: number, updateEventSectorDto: UpdateEventSectorDto) {
    return `This action updates a #${id} eventSector`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventSector`;
  }
}
