import { IsUUID, IsOptional, IsDateString, IsObject, IsNumber } from 'class-validator';

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

	@IsNumber()
	@IsOptional()
	score?: number;

	@IsNumber()
	@IsOptional()
	bonusScore?: number;

	@IsUUID()
	localId?: string;
}
