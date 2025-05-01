import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';
import { CreateExperienceDto } from '../dto/create-experience.dto';
import { UpdateExperienceDto } from '../dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
	constructor(
		@InjectRepository(Experience)
		private experiencesRepository: Repository<Experience>
	) {}

	async findAll() {
		return this.experiencesRepository.find();
	}

	async findOne(id: string): Promise<Experience> {
		const experience = await this.experiencesRepository.findOneBy({ id });
		if (!experience) {
			throw new NotFoundException(`Experience with ID ${id} not found`);
		}
		return experience;
	}

	async create(createExperienceDto: CreateExperienceDto): Promise<Experience> {
		const experience = this.experiencesRepository.create(createExperienceDto);
		return await this.experiencesRepository.save(experience);
	}

	async update(id: string, updateExperienceDto: UpdateExperienceDto): Promise<Experience> {
		const experience = await this.experiencesRepository.preload({
			id: id,
			...updateExperienceDto,
		});

		if (!experience) {
			throw new NotFoundException(`Experience with ID ${id} not found`);
		}

		return await this.experiencesRepository.save(experience);
	}

	async remove(id: string): Promise<void> {
		const result = await this.experiencesRepository.delete(id);

		if (result.affected === 0) {
			throw new NotFoundException(`Experience with ID ${id} not found`);
		}
	}
}
