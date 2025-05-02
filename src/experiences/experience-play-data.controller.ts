import { Controller, Get, Post, Put, Body, Param, ParseUUIDPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateExperiencePlayDataDto } from './dto/create-experience-play-data.dto';
import { UpdateExperiencePlayDataDto } from './dto/update-experience-play-data.dto';

import { ExperiencePlayDataService } from './services/experience-play-data.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

	@Get('attendee/:attendeeId')
	@ApiOperation({ summary: 'Get all play data by attendeeId' })
	@ApiResponse({ status: 200, description: 'Return all play data for the attendee' })
	async findByAttendeeId(@Param('attendeeId', new ParseUUIDPipe()) attendeeId: string) {
		const playData = await this.experiencePlayDataService.findByAttendeeId(attendeeId);
		return { playData };
	}
	@Post('import/:eventId')
	@ApiOperation({ summary: 'Import experience play data from Excel file' })
	@ApiResponse({ status: 201, description: 'Experience play data imported successfully' })
	@UseInterceptors(FileInterceptor('file'))
	async importFromExcel(@UploadedFile() file: Express.Multer.File, @Param('eventId', new ParseUUIDPipe()) eventId: string) {
		const importedData = await this.experiencePlayDataService.importFromExcel(file, eventId);
		return importedData;
	}
}
