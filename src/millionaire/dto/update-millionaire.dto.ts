import { PartialType } from '@nestjs/swagger';
import { CreateMillionaireDto } from './create-millionaire.dto';

export class UpdateMillionaireDto extends PartialType(CreateMillionaireDto) {}
