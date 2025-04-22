import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NetworkingParticipant, NetworkingRole } from './entities/networking-participant.entity';
import { Networking } from './entities/networking.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class NetworkingParticipantService {
	constructor(
		@InjectRepository(NetworkingParticipant)
		private readonly participantRepo: Repository<NetworkingParticipant>,

		@InjectRepository(Networking)
		private readonly networkingRepo: Repository<Networking>,

		@InjectRepository(Attendee)
		private readonly attendeeRepo: Repository<Attendee>
	) {}

	async importByAttendeeIds(networkingId: string, attendeeIds: string[]) {
		const attendees = await this.attendeeRepo.find({ where: { id: In(attendeeIds) } });
		return this.createParticipants(networkingId, attendees);
	}

	async importByEmails(networkingId: string, emails: string[]) {
		const attendees = await this.attendeeRepo.find({ where: { email: In(emails) } });
		return this.createParticipants(networkingId, attendees, emails, 'email');
	}

	/* async importByExcel(networkingId: string, file: Express.Multer.File) {
		const workbook = XLSX.read(file.buffer, { type: 'buffer' });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const data = XLSX.utils.sheet_to_json(sheet);

		const attendeeIds: string[] = [];
		const emails: string[] = [];

		for (const row of data) {
			if ('attendeeId' in row && row['attendeeId']) {
				attendeeIds.push(row['attendeeId']);
			} else if ('email' in row && row['email']) {
				emails.push(row['email']);
			}
		}

		if (attendeeIds.length > 0) {
			return this.importByAttendeeIds(networkingId, attendeeIds);
		} else if (emails.length > 0) {
			return this.importByEmails(networkingId, emails);
		} else {
			throw new BadRequestException('Excel must contain attendeeId or email columns');
		}
	} */

	private async createParticipants(
		networkingId: string,
		attendees: Attendee[],
		inputList?: string[],
		inputKey: 'id' | 'email' = 'id'
	) {
		const networking = await this.networkingRepo.findOne({ where: { id: networkingId } });
		if (!networking) throw new BadRequestException('Networking not found');

		const foundKeys = attendees.map((a) => a[inputKey]);
		const existing = await this.participantRepo.find({
			where: {
				networking: { id: networkingId },
				attendee: In(attendees.map((a) => a.id)),
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
			created: created.map((p) => p.attendee[inputKey]),
			skipped: (inputList || attendees.map((a) => a[inputKey])).filter((key) =>
				existingPairs.has(attendees.find((a) => a[inputKey] === key)?.id)
			),
			notFound: inputList ? inputList.filter((key) => !foundKeys.includes(key)) : [],
		};
	}

	async assignRole(networkingId: string, attendeeId: string, role: NetworkingRole) {
		const networking = await this.networkingRepo.findOne({ where: { id: networkingId } });
		if (!networking) throw new BadRequestException('Networking not found');

		const attendee = await this.attendeeRepo.findOne({ where: { id: attendeeId } });
		if (!attendee) throw new BadRequestException('Attendee not found');

		let participant = await this.participantRepo.findOne({
			where: {
				networking: { id: networkingId },
				attendee: { id: attendeeId },
			},
		});

		if (participant) {
			participant.role = role;
			await this.participantRepo.save(participant);
			return { updated: true, participant };
		} else {
			participant = this.participantRepo.create({
				networking,
				attendee,
				role,
			});
			await this.participantRepo.save(participant);
			return { created: true, participant };
		}
	}
}
