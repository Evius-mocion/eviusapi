import { IsString, IsUUID, IsEnum, MaxLength } from 'class-validator';
import { QuestionType } from '../enums/question-type.enum';

export class CreateQuestionDto {
    @IsString()
    @MaxLength(500)
    value: string;

    @IsEnum(QuestionType)
    type: QuestionType;

    @IsUUID()
    surveyId: string;
}