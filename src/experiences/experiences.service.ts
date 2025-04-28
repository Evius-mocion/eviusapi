import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperiencesService {
	constructor(
		@InjectRepository(Experience)
		private experiencesRepository: Repository<Experience>
	) {}

	async findAll() {
		return this.experiencesRepository.find();
	}

	async findById(id: string) {
		const experience = await this.experiencesRepository.findOneBy({ id });
		if (!experience) {
			throw new Error('Experience not found');
		}
		return experience;
	}

	async create(createExperienceDto: CreateExperienceDto) {
		const experience = this.experiencesRepository.create(createExperienceDto);
		return await this.experiencesRepository.save(experience);
	}
}
