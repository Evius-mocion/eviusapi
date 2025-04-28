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



	@ManyToOne(() => Attendee, (attendee) => attendee.requesters)
	@JoinColumn({ name: 'requester_id', referencedColumnName: 'id' })
	requester: Attendee; // El asistente que solicita


	@ManyToOne(() => Attendee,(attendee) => attendee.receivers)
	@JoinColumn({ name: 'receiver_id', referencedColumnName: 'id' })
	receiver: Attendee; // El asistente que recibe la solicitud



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
