import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NetworkingParticipant } from './entities/networking-participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NetworkingParticipantService {
	constructor(
		@InjectRepository(NetworkingParticipant)
		private readonly networkingParticipantRepository: Repository<NetworkingParticipant>
	) {}
}
