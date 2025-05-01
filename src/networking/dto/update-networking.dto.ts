import { PartialType } from '@nestjs/swagger';
import { CreateNetworkingDto } from './create-networking.dto';
import { Exclude } from 'class-transformer';

export class UpdateNetworkingDto extends PartialType(CreateNetworkingDto) {
	@Exclude()
	eventId: string;

	@Exclude()
	active?: boolean;
}
