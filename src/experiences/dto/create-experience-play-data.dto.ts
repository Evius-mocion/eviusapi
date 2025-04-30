import { IsUUID, IsOptional, IsDateString, IsObject } from 'class-validator';

export class CreateExperiencePlayDataDto {
	@IsUUID()
	eventExperienceId: string;

	@IsUUID()
	@IsOptional()
	attendeeId?: string;

	@IsDateString()
	play_timestamp: string;

	@IsObject()
	@IsOptional()
	data?: any;
}
