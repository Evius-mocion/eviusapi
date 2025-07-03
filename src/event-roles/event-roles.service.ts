import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateEventRoleDto } from './dto/create-event-role.dto';
import { UpdateEventRoleDto } from './dto/update-event-role.dto';
import { EventRole } from './entities/event-role.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventRolesService {
  constructor(
    @InjectRepository(EventRole)
    private eventRolesRepository: Repository<EventRole>,
  ) {}

  async create(eventId: string, createEventRoleDto: CreateEventRoleDto) {
    try {
      const roleExists = await this.eventRolesRepository.findOne({
        where: {
          event: { id: eventId },
          number: createEventRoleDto.number,
        },
      });

      if (roleExists) {
        throw new UnprocessableEntityException('Role with this number already exists for the event');
      }

      return await this.eventRolesRepository.save({ ...createEventRoleDto, event: { id: eventId } });
    } catch (error) {
      if (error.response?.message.includes('number')) { // Unique constraint violation
        throw new UnprocessableEntityException('Role with this number already exists for the event');
      }

      throw new InternalServerErrorException('Error creating event role');
    }
  }

  async findAll(eventId: string) {
    try {
      console.log(eventId)
      return await this.eventRolesRepository.find({
        where: { event: { id: eventId } },
        order: {
          number: 'ASC',
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching event roles');
    }
  }

  async findOne(id: string) {
    try {
      return await this.eventRolesRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Event role not found');
    }
  }

  async update(id: string, updateEventRoleDto: UpdateEventRoleDto) {
    try {
      await this.eventRolesRepository.update(id, updateEventRoleDto);
      return await this.findOne(id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error updating event role');
    }
  }

  async remove(id: string) {
    try {
      return await this.eventRolesRepository.delete(id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error deleting event role');
    }
  }
}
