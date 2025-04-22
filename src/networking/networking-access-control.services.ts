import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NetworkingParticipant } from './entities/networking-participant.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';
import { AdmissionTypes } from './types/admissionType';
import { Networking } from './entities/networking.entity';

@Injectable()
export class NetworkingAccessControlService {
	constructor(
		@InjectRepository(Attendee)
		private readonly attendeeRepository: Repository<Attendee>,
		@InjectRepository(Networking)
		private readonly networkingRepository: Repository<Networking>,
		@InjectRepository(NetworkingParticipant)
		private readonly participantRepository: Repository<NetworkingParticipant>
	) {}

	/**
	 * Checks if an attendee can access a specific networking session based on admission rules.
	 */
	async canAccessNetworking(attendeeId: string, networkingId: string): Promise<boolean> {
		// 1. Get Networking and Attendee info concurrently
		const [networking, attendee] = await Promise.all([
			this.networkingRepository.findOne({ where: { id: networkingId }, relations: ['event'] }), // Ensure event relation is loaded
			this.attendeeRepository.findOneBy({ id: attendeeId }),
		]);

		// Basic validation
		if (!networking) {
			throw new NotFoundException(`Networking session with ID ${networkingId} not found.`);
		}
		if (!attendee) {
			throw new NotFoundException(`Attendee with ID ${attendeeId} not found.`);
		}
		if (!networking.event || networking.event.id !== attendee.eventId) {
			// Attendee does not belong to the same event as the networking session
			return false;
		}

		// 2. Evaluate admission type
		switch (networking.admission_type) {
			case AdmissionTypes.ALL:
				// Everyone in the event can access
				return true;

			case AdmissionTypes.SELECTED:
				// Check if a participant record exists for this attendee and networking
				const participant = await this.participantRepository.findOne({
					where: {
						attendee: { id: attendeeId },
						networking: { id: networkingId },
					},
					select: ['id'], // Only need to check existence
				});
				return !!participant; // Return true if participant exists, false otherwise

			case AdmissionTypes.ROLE:
				// TODO: Implement role-based access check
				// 1. Get the attendee's role (assuming a 'role' field exists on Attendee entity)
				// const attendeeRole = attendee.role; // Example: Replace 'role' with the actual field name
				// 2. Get the allowed roles from the networking configuration (assuming 'allowed_roles' field exists)
				// const allowedRoles = networking.allowed_roles; // Example: Replace 'allowed_roles' with the actual field name
				// 3. Check if attendeeRole is included in allowedRoles
				// if (!attendeeRole || !allowedRoles || !Array.isArray(allowedRoles)) {
				//     console.warn(`Role or allowed_roles configuration missing for attendee ${attendeeId} or networking ${networkingId}`);
				//     return false;
				// }
				// return allowedRoles.includes(attendeeRole);
				console.warn(`Role-based access control not yet fully implemented for networking ${networkingId}.`);
				return false; // Default to false until implemented

			default:
				console.error(`Unknown admission type "${networking.admission_type}" for networking ${networkingId}`);
				return false; // Deny access for unknown types
		}
	}
}
