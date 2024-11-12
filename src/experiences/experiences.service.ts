import { Injectable } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';

@Injectable()
export class ExperiencesService {

  constructor(
    @InjectRepository(Experience)
    private experiencesRepository: Repository<Experience>,
  ) { }

  create(createExperienceDto: CreateExperienceDto) {
    return 'This action adds a new experience';
  }

  async findAll() {
    return this.experiencesRepository.find();
  }

  findByEventId(eventId: string) {
    return this.experiencesRepository.find({
      where: {
        event: {
          id: eventId
        }
      }
    });
  }
  
  findByIds(ids: string[] = []) {
    return this.experiencesRepository.findBy({id: In(ids)});
  }

  async findById(id: string) {
    return this.experiencesRepository.findOneBy({id});
  }

  findOne(id: number) {
    return `This action returns a #${id} experience`;
  }

  update(id: number, updateExperienceDto: UpdateExperienceDto) {
    return `This action updates a #${id} experience`;
  }

  remove(id: number) {
    return `This action removes a #${id} experience`;
  }
}
