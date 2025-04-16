import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, RelationId } from 'typeorm';
import { Meeting } from './meeting.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';

@Entity('meeting_participant')
export class MeetingParticipant {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Meeting, (meeting) => meeting.participants)
	@JoinColumn({ name: 'meeting_id' })
	meeting: Meeting;

	@RelationId((meetingParticipant: MeetingParticipant) => meetingParticipant.meeting)
	meetingId: string;

	@ManyToOne(() => Attendee, { eager: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'attendee_id' })
	attendee: Attendee;

	@RelationId((mp: MeetingParticipant) => mp.attendee)
	attendeeId: string;

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;
}
