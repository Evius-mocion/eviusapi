import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum, IsBoolean, IsNumber, IsUUID } from 'class-validator';
import { AdmissionTypes } from '../types/admissionType';

export class CreateNetworkingDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsUUID()
	eventId: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsBoolean()
	@IsOptional()
	active?: boolean;

	@IsDateString()
	@IsNotEmpty()
	opening_date: Date;

	@IsDateString()
	@IsNotEmpty()
	closing_date: Date;

	@IsEnum(AdmissionTypes)
	@IsOptional()
	admission_type?: AdmissionTypes;

	@IsString()
	@IsOptional()
	role_admission?: string;

	@IsBoolean()
	@IsOptional()
	chat_open?: boolean;

	@IsBoolean()
	@IsOptional()
	enable_face_to_face_chat?: boolean;

	@IsNumber()
	@IsOptional()
	max_quantity_per_called?: number;

	@IsNumber()
	@IsOptional()
	meeting_time?: number;
}
