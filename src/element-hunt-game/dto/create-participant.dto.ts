import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
	@ApiProperty({ description: 'ID of the game session' })
	@IsUUID()
	@IsNotEmpty()
	gameId: string;
	@ApiProperty({ description: 'ID of the attendee/user participating' })
	@IsUUID()
	@IsNotEmpty()
	attendeeId: string;
}
