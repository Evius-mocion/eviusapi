import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ExperienceCategoryEnum, ExperienceFieldDefinition } from '../types/experience.type';
import { Type } from 'class-transformer';

export class CreateExperienceDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsEnum(ExperienceCategoryEnum)
	category: ExperienceCategoryEnum;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Object)
	structure_definition?: ExperienceFieldDefinition[];
}
