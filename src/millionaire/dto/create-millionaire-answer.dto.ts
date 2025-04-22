
import { IsString, IsUUID,  } from 'class-validator';

export class CreateMillionaireAnswerDto {
	@IsString()
	@IsUUID()
	attendee_id: string;

	@IsString()
	@IsUUID()
	question_id: string;

	@IsString()
	@IsUUID()
	option_id: string;

	@IsString()
	@IsUUID()
	millonare_id: string;

}