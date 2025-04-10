import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { EventService } from '../event/event.service'; // Import EventService
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplateService {
	constructor(
		@InjectRepository(EmailTemplate)
		private templateRepository: Repository<EmailTemplate>,
		private eventService: EventService // Inject EventService
	) {}

	async create(createTemplateDto: CreateTemplateDto): Promise<EmailTemplate> {
		await this.eventService.findOneBy(createTemplateDto.eventId);
		const template = this.templateRepository.create({ ...createTemplateDto, event: { id: createTemplateDto.eventId } });
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

	async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<EmailTemplate> {
		const existingTemplate = await this.findOne(id);
		if (!existingTemplate) {
			throw new NotFoundException(`Template with ID ${id} not found`);
		}

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
		// Validate event exists
		await this.eventService.findOneBy(eventId);

		const templates = await this.templateRepository.find({
			where: { event: { id: eventId } },
		});

		return templates;
	}
}
