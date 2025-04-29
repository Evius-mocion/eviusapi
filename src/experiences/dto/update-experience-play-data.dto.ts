import { PartialType } from '@nestjs/mapped-types';
import { CreateExperiencePlayDataDto } from './create-experience-play-data.dto';

export class UpdateExperiencePlayDataDto extends PartialType(CreateExperiencePlayDataDto) {}
