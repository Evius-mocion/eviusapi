import { PartialType } from '@nestjs/swagger';
import { CreateExperienceDto } from './create-experience.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {
	@IsBoolean()
	@IsOptional()
	is_custom: boolean;
}
