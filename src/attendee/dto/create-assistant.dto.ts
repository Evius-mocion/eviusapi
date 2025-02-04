import { Transform, Type } from 'class-transformer';
import { IsArray, IsEmail, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { User } from 'src/common/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

export class CreateAssistantDto {
	@Transform(({ value }) => value.trim())
	@IsString()
	@MinLength(5)
    @IsOptional()
	fullName?: string;

	@Transform(({ value }) => value.toLowerCase())
	@IsEmail()
	email: string;

	@Transform(({ value }) => value.trim())
	@IsString()
	eventId: string;

	@IsObject()
	@IsOptional()
	attendeeData?: IAttendeeData;

}

export class CreateMasiveAssistantDto {
	@IsArray()
	@Type(() => CreateAssistantDto)
	attendees: CreateAssistantDto[];

	@IsString()
	eventId: string;
}

interface IAttendeeData {
	[key: string]: string;
}

export class AssistantDto {
	fullName: string;

	user: User;

	event: Event;

	email: string;

	country: string;

	city?: string;

	browser?: string;

	plataform?: string;
}
