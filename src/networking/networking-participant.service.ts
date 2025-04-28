import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NetworkingParticipant, NetworkingRole } from './entities/networking-participant.entity';
import { NetworkingService } from './networking.service';
import { Attendee } from 'src/attendee/entities/attendee.entity';
import { AdmissionTypes } from './types/admissionType';
import { Networking } from './entities/networking.entity';

@Injectable()
export class NetworkingParticipantService {
	constructor(
		@InjectRepository(NetworkingParticipant)
		private readonly participantRepository: Repository<NetworkingParticipant>,
		@InjectRepository(Attendee)
		private readonly attendeeRepository: Repository<Attendee>,
		@InjectRepository(Networking) // Inject Networking repository if needed directly
		private readonly networkingRepository: Repository<Networking>,
		private readonly networkingService: NetworkingService // Use existing service for fetching Networking entities
	) {}

	/**
	 * Creates a new participant record.
	 */
	async create(
		attendeeId: string,
		networkingId: string,
		role: NetworkingRole = NetworkingRole.PARTICIPANT
	): Promise<NetworkingParticipant> {
		const networking = await this.networkingService.findOne(networkingId);
		const attendee = await this.attendeeRepository.findOneBy({ id: attendeeId });

		if (!attendee) {
			throw new NotFoundException(`Attendee with ID ${attendeeId} not found.`);
		}

		// Check if participant already exists for this combination
		const existingParticipant = await this.findByAttendeeIdAndNetworkingId(attendeeId, networkingId);
		if (existingParticipant) {
			throw new BadRequestException(`Participant already exists for attendee ${attendeeId} in networking ${networkingId}.`);
		}

		const participant = this.participantRepository.create({
			attendee,
			networking,
			role,
		});

		try {
			return await this.participantRepository.save(participant);
		} catch (error) {
			// Handle potential database errors
			throw new InternalServerErrorException(`Failed to create participant: ${error.message}`);
		}
	}

	/**
	 * Finds a participant by attendee and networking IDs.
	 */
	async findByAttendeeIdAndNetworkingId(attendeeId: string, networkingId: string): Promise<NetworkingParticipant | null> {
		return this.participantRepository.findOne({
			where: {
				attendee: { id: attendeeId },
				networking: { id: networkingId },
			},
			relations: ['attendee', 'networking'], // Load relations if needed
		});
	}

	/**
	 * Imports participants based on an array of Attendee IDs.
	 * Skips existing participants and attendees not found.
	 */
	async importParticipantsByAttendeeIds(
		networkingId: string,
		attendeeIds: string[]
	): Promise<{ created: NetworkingParticipant[]; skipped: string[]; notFound: string[] }> {
		if (!attendeeIds || attendeeIds.length === 0) {
			return { created: [], skipped: [], notFound: [] };
		}

		await this.networkingService.findOne(networkingId); // Validate networking exists

		// Find which attendees actually exist
		const existingAttendees = await this.attendeeRepository.find({
			where: { id: In(attendeeIds) },
			select: ['id'], // Only need IDs
		});
		const existingAttendeeIds = new Set(existingAttendees.map((a) => a.id));
		const notFoundAttendeeIds = attendeeIds.filter((id) => !existingAttendeeIds.has(id));

		// Filter out attendees that were not found
		const validAttendeeIds = attendeeIds.filter((id) => existingAttendeeIds.has(id));
		if (validAttendeeIds.length === 0) {
			return { created: [], skipped: [], notFound: notFoundAttendeeIds };
		}

		// Find which participants already exist for this networking session
		const existingParticipants = await this.participantRepository.find({
			where: {
				networking: { id: networkingId },
				attendee: { id: In(validAttendeeIds) },
			},
			relations: ['attendee'],
		});
		const existingParticipantAttendeeIds = new Set(existingParticipants.map((p) => p.attendee.id));

		// Determine which participants need to be created
		const attendeeIdsToCreate = validAttendeeIds.filter((id) => !existingParticipantAttendeeIds.has(id));
		const skippedAttendeeIds = validAttendeeIds.filter((id) => existingParticipantAttendeeIds.has(id));

		const createdParticipants: NetworkingParticipant[] = [];
		if (attendeeIdsToCreate.length > 0) {
			const participantsToSave = attendeeIdsToCreate.map((id) =>
				this.participantRepository.create({
					networking: { id: networkingId }, // Use ID directly for creation
					attendee: { id: id }, // Use ID directly for creation
					role: NetworkingRole.PARTICIPANT, // Default role
				})
			);
			// Consider using transactions here for bulk insert
			try {
				const saved = await this.participantRepository.save(participantsToSave);
				createdParticipants.push(...saved);
			} catch (error) {
				throw new InternalServerErrorException(`Failed during bulk participant creation: ${error.message}`);
			}
		}

		return {
			created: createdParticipants,
			skipped: skippedAttendeeIds,
			notFound: notFoundAttendeeIds,
		};
	}

	/**
	 * Imports participants based on an array of emails.
	 * Skips existing participants and emails not found.
	 */
	/* async importParticipantsByEmails(
		networkingId: string,
		emails: string[]
	): Promise<{ created: NetworkingParticipant[]; skipped: string[]; notFound: string[] }> {
		if (!emails || emails.length === 0) {
			return { created: [], skipped: [], notFound: [] };
		}
		// Normalize emails (e.g., to lowercase)
		const normalizedEmails = emails.map((email) => email.toLowerCase().trim());

		await this.networkingService.findOne(networkingId); // Validate networking exists

		// Find attendees by email
		const existingAttendees = await this.attendeeRepository.find({
			where: { email: In(normalizedEmails) },
		});
		const attendeeMap = new Map(existingAttendees.map((a) => [a.email.toLowerCase(), a]));
		const foundEmails = new Set(existingAttendees.map((a) => a.email.toLowerCase()));
		const notFoundEmails = normalizedEmails.filter((email) => !foundEmails.has(email));

		const validAttendees = existingAttendees;
		if (validAttendees.length === 0) {
			return { created: [], skipped: [], notFound: notFoundEmails };
		}
		const validAttendeeIds = validAttendees.map((a) => a.id);

		// Find existing participants
		const existingParticipants = await this.participantRepository.find({
			where: {
				networking: { id: networkingId },
				attendee: { id: In(validAttendeeIds) },
			},
			relations: ['attendee'],
		});
		const existingParticipantAttendeeIds = new Set(existingParticipants.map((p) => p.attendee.id));

		// Determine which participants need to be created
		const attendeesToCreate = validAttendees.filter((a) => !existingParticipantAttendeeIds.has(a.id));
		const skippedAttendees = validAttendees.filter((a) => existingParticipantAttendeeIds.has(a.id));

		const createdParticipants: NetworkingParticipant[] = [];
		if (attendeesToCreate.length > 0) {
			const participantsToSave = attendeesToCreate.map((attendee) =>
				this.participantRepository.create({
					networking: { id: networkingId },
					attendee: { id: attendee.id },
					role: NetworkingRole.PARTICIPANT,
				})
			);
			try {
				const saved = await this.participantRepository.save(participantsToSave);
				createdParticipants.push(...saved);
			} catch (error) {
				throw new InternalServerErrorException(`Failed during bulk participant creation by email: ${error.message}`);
			}
		}

		return {
			created: createdParticipants,
			skipped: skippedAttendees.map((a) => a.email), // Return skipped emails
			notFound: notFoundEmails,
		};
	} */

	/**
	 * Assigns or updates the role for a participant. Creates the participant if not found.
	 */
	async assignRoleToParticipant(networkingId: string, attendeeId: string, role: NetworkingRole): Promise<NetworkingParticipant> {
		let participant = await this.findByAttendeeIdAndNetworkingId(attendeeId, networkingId);

		if (participant) {
			// Update existing participant's role
			if (participant.role !== role) {
				participant.role = role;
				try {
					await this.participantRepository.save(participant);
				} catch (error) {
					throw new InternalServerErrorException(`Failed to update participant role: ${error.message}`);
				}
			}
		} else {
			// Create new participant if not found
			// Validation for attendee and networking happens within the create method
			participant = await this.create(attendeeId, networkingId, role);
		}

		return participant;
	}
	async getParticipantsByAdmissionType(networkingId: string) {
		// 1. Fetch the networking session details, including its event and admission type
		const networking = await this.networkingService.findOne(networkingId); // Assuming findOne loads the event relation or eventId

		// Ensure the event ID is available. If findOne doesn't load the relation, fetch it separately or adjust findOne.
		const eventId = networking.event?.id || networking.event.id; // Adjust based on your Networking entity structure
		if (!eventId) {
			throw new NotFoundException(`Event details not found for networking session ${networkingId}`);
		}

		// 2. Build the base query to fetch attendees and their participation for this networking session
		const query = this.attendeeRepository
			.createQueryBuilder('attendee')
			// Left join to include the participation record ONLY for the specified networkingId
			.leftJoinAndSelect('attendee.networkingParticipations', 'participation', 'participation.networking_id = :networkingId', {
				networkingId,
			})
			.where('attendee.eventId = :eventId', { eventId }); // Filter attendees by the event

		// 3. Adjust the query based on the admission type
		switch (networking.admission_type) {
			case AdmissionTypes.ALL:
				// Return all attendees from the event. The left join handles including participation if it exists.
				return query.getMany();

			case AdmissionTypes.SELECTED:
				// Filter to return only attendees who have a participation record for this networking session
				query.andWhere('participation.id IS NOT NULL');
				return query.getMany();

			case AdmissionTypes.ROLE:
				// TODO: Implement role-based filtering once the role field exists on Attendee
				// For now, return all attendees from the event (same as ALL)
				console.warn(`Role-based filtering not yet implemented for networking ${networkingId}. Returning all event attendees.`);
				return query.getMany();

			default:
				// Handle unknown admission types if necessary
				throw new Error(`Unknown admission type: ${networking.admission_type}`);
		}
	}
}
