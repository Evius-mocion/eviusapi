import { Body, Controller, Get, Post, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ExperiencesService } from './services/experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Controller('experiences')
export class ExperiencesController {
	constructor(private readonly experiencesService: ExperiencesService) {}
	@Get()
	async findAll() {
		const experiences = await this.experiencesService.findAll();
		return { experiences };
	}

	@Get(':id')
	async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
		const experience = await this.experiencesService.findOne(id);
		return { experience };
	}

	@Post()
	async create(@Body() createExperienceDto: CreateExperienceDto) {
		const experience = await this.experiencesService.create(createExperienceDto);
		return { experience };
	}

	@Patch(':id')
	async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateExperienceDto: UpdateExperienceDto) {
		const experience = await this.experiencesService.update(id, updateExperienceDto);
		return { experience };
	}
}
