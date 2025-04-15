import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMillionaireDto } from './dto/create-millionaire.dto';
import { UpdateMillionaireDto } from './dto/update-millionaire.dto';
import { Millionaire } from './entities/millionaire.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MillionaireService {
     constructor(
        @InjectRepository(Millionaire)
        private readonly millionairesRepository: Repository<Millionaire>,
     ) {}

    async create(createMillionaireDto: CreateMillionaireDto) {
        
        const newMillionaire = this.millionairesRepository.create(createMillionaireDto);
        
       const millionaire = await  this.millionairesRepository.save(newMillionaire);

        return millionaire;
    }

    async findAll() {
        return await this.millionairesRepository.find();
    }

    async findOne(id: string) {
        const millionaire = await this.millionairesRepository.findOneBy({ id });
        if (!millionaire) {
           throw new NotFoundException(`Millionaire with ID ${id} not found`); 
        }
        return millionaire;
    }

    async update(id: string, updateMillionaireDto: UpdateMillionaireDto) {
        const millionaire = await this.findOne(id);
        if (!millionaire) {
            throw new NotFoundException(`Millionaire with ID ${id} not found`);
       }

        Object.assign(millionaire, updateMillionaireDto)

        return await this.millionairesRepository.save(millionaire);
    }

   async remove(id: string) {
      const result = await this.millionairesRepository.delete(id);
      if (!result.affected || result.affected === 0) {
        throw new NotFoundException(`Millionaire with ID ${id} not found`);
      }
      return { message: 'Millionaire deleted successfully' };
    }
}
