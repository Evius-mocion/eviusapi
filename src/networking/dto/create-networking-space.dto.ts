import { IsString, IsNotEmpty, IsInt, IsDateString, IsOptional, IsEnum, IsArray, IsUUID, IsBoolean } from 'class-validator';

import { MicrophoneMode } from '../interfaces/networking.interface';

export class CreateNetworkingSpaceDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	topic: string;

	@IsInt()
	@IsOptional()
	capacity?: number;

	@IsDateString()
	@IsNotEmpty()
	start_time: Date;

	@IsDateString()
	@IsNotEmpty()
	end_time: Date;

	@IsArray()
	@IsOptional()
	keywords?: string[];

	@IsEnum(MicrophoneMode)
	@IsOptional()
	microphone_mode?: MicrophoneMode;

	@IsBoolean()
	@IsOptional()
	chat_enabled?: boolean;

	@IsUUID()
	@IsNotEmpty()
	networkingId: string;
}
