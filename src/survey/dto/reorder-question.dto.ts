import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class QuestionReorderDto {
	@ApiProperty({
		type: [String],
		description: 'Array of question IDs in new order',
	})
	@IsUUID('4', { each: true })
	questionIds: string[];
}
