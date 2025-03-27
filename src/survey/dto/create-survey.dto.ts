import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSurveyDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsUUID()
	eventId: string;

	@IsOptional()
	@IsUUID()
	activityId?: string;
}
