import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { QuestionType } from '../enums/question-type.enum';

export class UpdateQuestionDto {
    @IsString()
    @MaxLength(500)
    @IsOptional()
    value?: string;

    @IsEnum(QuestionType)
    @IsOptional()
    type?: QuestionType;
}