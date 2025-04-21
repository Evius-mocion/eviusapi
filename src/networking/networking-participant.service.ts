import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NetworkingParticipant, NetworkingRole } from './entities/networking-participant.entity';
import { Networking } from './entities/networking.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';

@Injectable()
export class NetworkingParticipantService {
	constructor(
		@InjectRepository(NetworkingParticipant)
		private readonly participantRepo: Repository<NetworkingParticipant>,
		@InjectRepository(Networking)
		private readonly networkingRepo: Repository<Networking>,
		@InjectRepository(Attendee)
		private readonly attendeeService: Repository<Attendee>
	) {}

	async importByAttendeeIds(networkingId: string, attendeeIds: string[]) {
		const networking = await this.networkingRepo.findOne({ where: { id: networkingId } });
		if (!networking) throw new BadRequestException('Networking not found');

		const attendees = await this.attendeeService.find({ where: { id: In(attendeeIds) } });
		const foundIds = attendees.map((a) => a.id);

		const existing = await this.participantRepo.find({
			where: {
				networking: { id: networkingId },
				attendee: In(foundIds),
			},
		});
		const existingPairs = new Set(existing.map((e) => e.attendee.id));

		const toCreate = attendees.filter((a) => !existingPairs.has(a.id));
		const created: NetworkingParticipant[] = [];

		for (const attendee of toCreate) {
			const participant = this.participantRepo.create({
				networking,
				attendee,
				role: NetworkingRole.PARTICIPANT,
			});
			created.push(await this.participantRepo.save(participant));
		}

		return {
			created: created.map((p) => p.attendee.id),
			skipped: attendeeIds.filter((id) => existingPairs.has(id)),
			notFound: attendeeIds.filter((id) => !foundIds.includes(id)),
		};
	}

	async importByEmails(networkingId: string, emails: string[]) {
		// Implement logic to find attendeeIds by email and create NetworkingParticipant
	}

	async importByExcel(networkingId: string, file: Express.Multer.File) {
		// Implement logic to parse Excel, extract attendeeIds or emails, and create NetworkingParticipant
	}

	async assignRole(networkingId: string, attendeeId: string, role: string) {
		// Implement logic to assign or update role, creating NetworkingParticipant if needed
	}
}
