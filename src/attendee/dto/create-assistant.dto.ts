import { Transform, Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsObject, IsOptional, isString, IsString, MinLength } from 'class-validator';
import { User } from 'src/common/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { CheckInType } from 'src/types/attendee.type';

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
	attendeeData?: Record<string, any>[];

	@IsString()
	@IsEnum(CheckInType)
	origin: CheckInType;
}

export class CreateMasiveAssistantDto {
	@IsArray()
	attendees: any[];

	@IsString()
	eventId: string;
}



export class AssistantDto {
	fullName: string;

	user: User;

	event: Event;

	email: string;

	country: string;

	city?: string;

	browser?: string;

	origin: CheckInType

	plataform?: string;

	properties?: Record<string, any>; 
}
