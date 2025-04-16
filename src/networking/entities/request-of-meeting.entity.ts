import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	RelationId,
} from 'typeorm';
import { Meeting } from './meeting.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';
import { RequestOfMeetingStatus } from '../interfaces/networking.interface';

@Entity('request_of_meeting')
export class RequestOfMeeting {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Meeting, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'meeting_id' })
	meeting: Meeting;

	@RelationId((rom: RequestOfMeeting) => rom.meeting)
	meetingId: string;

	@ManyToOne(() => Attendee, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'requester_id' })
	requester: Attendee; // El asistente que solicita

	@RelationId((rom: RequestOfMeeting) => rom.requester)
	requesterId: string;

	@ManyToOne(() => Attendee, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'receiver_id' })
	receiver: Attendee; // El asistente que recibe la solicitud

	@RelationId((rom: RequestOfMeeting) => rom.receiver)
	receiverId: string;

	@Column({
		type: 'enum',
		enum: RequestOfMeetingStatus,
		default: RequestOfMeetingStatus.REQUESTED,
	})
	status: RequestOfMeetingStatus;

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;
}
