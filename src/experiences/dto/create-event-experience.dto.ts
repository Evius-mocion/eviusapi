import { IsUUID, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateEventExperienceDto {
	@IsUUID()
	eventId: string;

	@IsUUID()
	experienceId: string;

	@IsString()
	@IsOptional()
	location?: string;

	@IsBoolean()
	@IsOptional()
	active?: boolean;
}
