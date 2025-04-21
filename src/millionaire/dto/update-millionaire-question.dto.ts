import { PartialType } from '@nestjs/mapped-types';
import { CreateMillionaireQuestionDto } from './create-millionaire-question.dto';

export class UpdateMillionaireQuestionDto extends PartialType(CreateMillionaireQuestionDto) {
    // This class will inherit all properties from CreateMillionaireQuestionDto
    // and make them optional for updates
}