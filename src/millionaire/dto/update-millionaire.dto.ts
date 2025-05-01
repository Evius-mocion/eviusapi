import { PartialType } from '@nestjs/mapped-types';
import { CreateMillionaireDto } from './create-millionaire.dto';

export class UpdateMillionaireDto extends PartialType(CreateMillionaireDto) {
    // This class will inherit all properties from CreateMillionaireDto
    // and make them optional for updates
}
