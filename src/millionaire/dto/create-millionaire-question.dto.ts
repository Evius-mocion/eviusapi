import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateMillionaireQuestionDto {
	@IsString()
	@IsUUID()
	millionaire_id: string;

	@IsString()
	@IsNotEmpty()
	text: string;

	@IsBoolean()
	check_point: boolean;

	@IsNumber()
	points: number;

	@IsString()
	@IsOptional()
	image?: string;
	// Add other properties as needed
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CreateMillionaireOptionDto)
	options: CreateMillionaireOptionDto[];
}

// Create DTO for millionaire options
export class CreateMillionaireOptionDto {
	@IsString()
	@IsNotEmpty()
	text: string;

	@IsBoolean()
	@IsNotEmpty()
	is_correct: boolean;
}
