import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';

@Controller('templates')
export class TemplateController {
	constructor(private readonly templateService: TemplateService) {}

	@Post()
	async create(@Body() createTemplateDto: CreateTemplateDto, @Body('predefinedTemplateId') predefinedTemplateId?: string) {
		const template = await this.templateService.create(createTemplateDto, predefinedTemplateId);
		return { template };
	}

	@Get()
	async findAll() {
		const templates = await this.templateService.findAll();
		return { templates };
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const template = await this.templateService.findOne(id);
		return { template };
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateTemplateDto: Partial<CreateTemplateDto>) {
		const template = await this.templateService.update(id, updateTemplateDto);
		return { template };
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		const template = await this.templateService.remove(id);
		return { template };
	}

	@Get('event/:eventId')
	async findByEventId(@Param('eventId') eventId: string) {
		const templates = await this.templateService.findByEventId(eventId);
		return { templates };
	}

	@Get('predefined')
	async findPredefinedTemplates() {
		const predefinedTemplates = await this.templateService.findPredefinedTemplates();
		return { predefinedTemplates };
	}
}
