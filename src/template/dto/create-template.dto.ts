import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateTemplateDto {
	@IsString()
	subject: string;

	@IsOptional()
	@IsString()
	header?: string;

	@IsBoolean()
	showEventDate: boolean;

	@IsOptional()
	@IsString()
	bodyImageUrl?: string;

	@IsOptional()
	@IsString()
	body?: string;

	@IsOptional()
	@IsString()
	footerImageUrl?: string;

	@IsUUID()
	eventId: string;
}
