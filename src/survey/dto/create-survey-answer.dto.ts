import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreateSurveyAnswerDto {
	@IsUUID()
	attendeeId: string;
	
	@IsUUID()
	@IsNotEmpty()
	questionId: string;

	@ValidateIf((o) => !o.response)
	@IsOptional()
	@IsUUID()
	optionId?: string;

	@ValidateIf((o) => !o.optionId)
	@IsOptional()
	@IsString()
	response?: string;
}
