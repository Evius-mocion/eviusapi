import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	RelationId,
	JoinColumn,
	OneToMany,
} from 'typeorm';
import { Networking } from './networking.entity';
import { MeetingParticipant } from './meeting-participant.entity';

@Entity('meeting')
export class Meeting {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	name: string;

	@OneToMany(() => MeetingParticipant, (meetingParticipant) => meetingParticipant.meeting)
	participants: MeetingParticipant[];

	@ManyToOne(() => Networking, (networking) => networking.id, { nullable: false })
	@JoinColumn({ name: 'networking_id' })
	networking: Networking;

	@RelationId((meeting: Meeting) => meeting.networking)
	networkingId: string;

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;
}
