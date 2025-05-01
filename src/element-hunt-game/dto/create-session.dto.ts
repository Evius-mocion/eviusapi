import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
	@ApiProperty({ description: 'ID of the participant starting the session' })
	@IsUUID()
	participantId: string;
}
