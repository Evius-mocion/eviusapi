import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { EventService } from '../event/event.service';

@Injectable()
export class TemplateService {
	constructor(
		@InjectRepository(EmailTemplate)
		private templateRepository: Repository<EmailTemplate>,
		private eventService: EventService
	) {}

	async create(createTemplateDto: CreateTemplateDto, predefinedTemplateId?: string): Promise<EmailTemplate> {
		await this.eventService.findOneBy(createTemplateDto.eventId);

		let templateData = createTemplateDto;
		if (predefinedTemplateId) {
			const predefinedTemplate = await this.findOne(predefinedTemplateId);
			if (!predefinedTemplate.isPredefined) {
				throw new BadRequestException('Template is not predefined');
			}
			templateData = { ...predefinedTemplate, ...createTemplateDto };
		}

		const template = this.templateRepository.create(templateData);
		return this.templateRepository.save(template);
	}

	async findAll(): Promise<EmailTemplate[]> {
		return this.templateRepository.find();
	}

	async findOne(id: string): Promise<EmailTemplate> {
		const template = await this.templateRepository.findOneBy({ id });
		if (!template) {
			throw new NotFoundException(`Template with ID ${id} not found`);
		}
		return template;
	}

	async update(id: string, updateTemplateDto: Partial<CreateTemplateDto>): Promise<EmailTemplate> {
		await this.templateRepository.update(id, updateTemplateDto);
		return this.findOne(id);
	}

	async remove(id: string): Promise<void> {
		const result = await this.templateRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException(`Template with ID ${id} not found`);
		}
	}

	async findByEventId(eventId: string): Promise<EmailTemplate[]> {
		await this.eventService.findOneBy(eventId);

		const templates = await this.templateRepository.find({
			where: { event: { id: eventId } },
		});

		return templates;
	}

	async findPredefinedTemplates(): Promise<EmailTemplate[]> {
		return this.templateRepository.find({
			where: { isPredefined: true },
		});
	}
}
