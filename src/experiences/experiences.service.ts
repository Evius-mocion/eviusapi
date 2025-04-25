import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';

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
		return this.experiencesRepository.findOneBy({ id });
	}
}
