import { Controller, Get, Post, Put, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateExperiencePlayDataDto } from './dto/create-experience-play-data.dto';
import { UpdateExperiencePlayDataDto } from './dto/update-experience-play-data.dto';

import { ExperiencePlayDataService } from './services/experience-play-data.service';

@ApiTags('experience-play-data')
@Controller('experience-play-data')
export class ExperiencePlayDataController {
	constructor(private readonly experiencePlayDataService: ExperiencePlayDataService) {}

	@Get(':id')
	@ApiOperation({ summary: 'Get experience play data by id' })
	@ApiResponse({ status: 200, description: 'Return experience play data by id' })
	async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
		const playData = await this.experiencePlayDataService.findOne(id);
		return { playData };
	}

	@Post()
	@ApiOperation({ summary: 'Create experience play data' })
	@ApiResponse({ status: 201, description: 'Experience play data created successfully' })
	async create(@Body() createDto: CreateExperiencePlayDataDto) {
		const eventExperience = await this.experiencePlayDataService.create(createDto);
		return { eventExperience };
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update experience play data' })
	@ApiResponse({ status: 200, description: 'Experience play data updated successfully' })
	async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateDto: UpdateExperiencePlayDataDto) {
		const experiencePlayData = await this.experiencePlayDataService.update(id, updateDto);
		return { experiencePlayData };
	}

	/* @Delete(':id')
	@ApiOperation({ summary: 'Delete experience play data' })
	@ApiResponse({ status: 200, description: 'Experience play data deleted successfully' })
	async remove(@Param('id', new ParseUUIDPipe()) id: string) {
		await this.experiencePlayDataService.remove(id);
		return {};
	} */
}
