import { Controller, Get } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';

@Controller('experiences')
export class ExperiencesController {
	constructor(private readonly experiencesService: ExperiencesService) {}
	@Get()
	async findAll() {
		const experiences = await this.experiencesService.findAll();
		return { experiences };
	}
}
