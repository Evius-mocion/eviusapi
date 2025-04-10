import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateDto } from './create-template.dto';
import { Exclude } from 'class-transformer';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
	@Exclude()
	eventId?: string;
}
