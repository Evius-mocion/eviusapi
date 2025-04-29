import { IsUUID, IsOptional, IsDateString, IsObject } from 'class-validator';

export class CreateExperiencePlayDataDto {
	@IsUUID()
	eventExperienceId: string;

	@IsUUID()
	attendeeId: string;

	@IsDateString()
	play_timestamp: string;

	@IsObject()
	@IsOptional()
	data?: any;
}
