import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { EventExperience } from './event-experience.entity';
import { Event } from 'src/event/entities/event.entity';
import { Experience } from './experience.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';

@Entity('experience_play_data')
export class ExperiencePlayData {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => EventExperience, (ee) => ee.playData, { nullable: false })
	@Index()
	eventExperience: EventExperience;

	@Column({ type: 'uuid' })
	eventExperienceId: string;

	@ManyToOne(() => Event, { nullable: false })
	event: Event;

	@Column({ type: 'uuid' })
	eventId: string;

	@ManyToOne(() => Experience, { nullable: false })
	experience: Experience;

	@Column({ type: 'uuid' })
	experienceId: string;

	@ManyToOne(() => Attendee, (attendee) => attendee.experiencePlayData, { nullable: true })
	@JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
	attendee: Attendee;

	@Column({ type: 'timestamp', nullable: false })
	play_timestamp: Date;

	@Column({ type: 'json', nullable: true })
	data: any;

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@Column({ type: 'float', nullable: true })
	score: number;

	@Column({ type: 'float', nullable: true })
	bonusScore: number;

	@Column({ type: 'uuid', nullable: true, unique: true })
	localId: string;
}
