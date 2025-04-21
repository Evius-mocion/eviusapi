import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum, IsBoolean, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { AdmissionTypes } from '../types/admissionType';
import { MeetingConfig } from '../interfaces/networking.interface';
import { Type } from 'class-transformer';

class MeetingConfigDto implements MeetingConfig {
	@IsBoolean()
	@IsOptional()
	chat_open?: boolean;

	@IsBoolean()
	@IsOptional()
	enable_face_to_face_chat?: boolean;

	@IsBoolean()
	@IsOptional()
	video_call_enabled?: boolean;

	@IsBoolean()
	@IsOptional()
	screen_share_enabled?: boolean;

	@IsBoolean()
	@IsOptional()
	raise_hand_enabled?: boolean;

	@IsNumber()
	@IsOptional()
	max_quantity_per_called?: number;

	@IsNumber()
	@IsOptional()
	meeting_time?: number;
}
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

	// Remove these from here:
	// @IsNumber()
	// @IsOptional()
	// max_quantity_per_called?: number;

	// @IsNumber()
	// @IsOptional()
	// meeting_time?: number;

	@ValidateNested()
	@Type(() => MeetingConfigDto)
	@IsOptional()
	meeting_config?: MeetingConfigDto;
}
