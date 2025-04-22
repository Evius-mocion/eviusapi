import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, Unique } from 'typeorm';
import { Networking } from './networking.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';

export enum NetworkingRole {
	MODERATOR = 'moderator',
	OBSERVER = 'observer',
	PARTICIPANT = 'participant',
}

@Entity()
@Unique(['attendeeId', 'networkingId'])
export class NetworkingParticipant {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'uuid' })
	attendeeId: string;

	@Column({ type: 'uuid' })
	networkingId: string;

	@ManyToOne(() => Attendee, { eager: true })
	@JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
	attendee: Attendee;

	@ManyToOne(() => Networking, (networking) => networking.participants)
	@JoinColumn({ name: 'networkingId' })
	networking: Networking;

	@Column({
		type: 'enum',
		enum: NetworkingRole,
		default: NetworkingRole.PARTICIPANT,
	})
	role: NetworkingRole;
}
