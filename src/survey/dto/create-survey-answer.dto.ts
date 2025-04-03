import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreateSurveyAnswerDto {
	@IsUUID()
	@IsNotEmpty()
	attendeeId: string;

	@IsUUID()
	@IsNotEmpty()
	questionId: string;

	@IsUUID()
	@IsNotEmpty()
	optionId?: string;

	@IsUUID()
	@IsNotEmpty()
	surveyId: string;

	@ValidateIf((o) => !o.response)
	@IsOptional()
	@IsString()
	option?: string;

	@ValidateIf((o) => !o.option)
	@IsOptional()
	@IsString()
	response?: string;
}
