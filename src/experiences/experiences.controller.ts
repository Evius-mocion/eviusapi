import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Controller('experiences')
export class ExperiencesController {
	constructor(private readonly experiencesService: ExperiencesService) {}
	@Get()
	async findAll() {
		const experiences = await this.experiencesService.findAll();
		return { experiences };
	}

	@Post()
	async create(@Body() createExperienceDto: CreateExperienceDto) {
		const experience = await this.experiencesService.create(createExperienceDto);
		return { experience };
	}
}
