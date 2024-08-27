import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Station } from './entities/station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from 'src/event';
import { Event } from 'src/event/entities/event.entity';
import { ExperiencesService } from 'src/experiences/experiences.service';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    private readonly eventService: EventService,
    private readonly experiencesService: ExperiencesService,
  ) {}
  
  async create(createStationDto: CreateStationDto) {

     const {eventId, experienceId , ...stationFields} = createStationDto;

     const event = await this.eventService.findOneBy(eventId);

     if (!event) {
       throw new NotFoundException("event not found");
     }

     const newstation =  this.stationRepository.create({
       event: event,
      ...stationFields
    });

     if (experienceId) {
        const exp = await this.experiencesService.findById(experienceId);

        if (!exp) throw new NotFoundException("experience not found");

        newstation.experience = exp;
     }

     return this.stationRepository.save(newstation);

  }

  async findAll(eventId: string) {
    try {
     return  this.stationRepository.find({
        where: {
          event: {
            id:  eventId 
          }
        }
      })
    } catch (error) {
      throw new InternalServerErrorException("error fetching stations");
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} station`;
  }

  update(id: number, updateStationDto: UpdateStationDto) {
    return `This action updates a #${id} station`;
  }

  remove(id: number) {
    return `This action removes a #${id} station`;
  }
}
