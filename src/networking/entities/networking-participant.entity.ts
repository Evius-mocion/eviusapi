import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, RelationId } from 'typeorm';
import { Networking } from './networking.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';

export enum NetworkingRole {
	MODERATOR = 'moderator',
	OBSERVER = 'observer',
	PARTICIPANT = 'participant',
}

@Entity('networking_participant')
export class NetworkingParticipant {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Networking, { nullable: false })
	@JoinColumn({ name: 'networking_id' })
	networking: Networking;

	@RelationId((participant: NetworkingParticipant) => participant.networking)
	networking_id: string;

	@ManyToOne(() => Attendee, { nullable: false })
	@JoinColumn({ name: 'attendee_id' })
	attendee: Attendee;

	@RelationId((participant: NetworkingParticipant) => participant.attendee)
	attendee_id: string;

	@Column({ type: 'enum', enum: NetworkingRole, default: NetworkingRole.PARTICIPANT })
	role: NetworkingRole;
}
