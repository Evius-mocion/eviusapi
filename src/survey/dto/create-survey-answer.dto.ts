import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSurveyAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  attendeeId: string;

  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsUUID()
  @IsNotEmpty()
  optionId: string;

  @IsUUID()
  @IsNotEmpty()
  surveyId: string;
}