import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	Unique,
	Index,
} from 'typeorm';
import { Event } from 'src/event/entities/event.entity';
import { Experience } from './experience.entity';
import { ExperiencePlayData } from './experience-play-data.entity';
import { JoinColumn } from 'typeorm';

@Entity('event_experience')
@Unique(['event', 'experience'])
export class EventExperience {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// Foreign key for Event
	@ManyToOne(() => Event, (event) => event.eventExperiences, { nullable: false })
	@JoinColumn({ name: 'eventId' })
	@Index()
	event: Event;
	@Column({ type: 'uuid' })
	eventId: string;

	// Foreign key for Experience
	@ManyToOne(() => Experience, { nullable: false })
	@JoinColumn({ name: 'experienceId' })
	@Index()
	experience: Experience;

	@Column({ type: 'uuid' })
	experienceId: string;

	@Column({ type: 'varchar', nullable: true })
	location: string;

	@Column({ type: 'boolean', default: true })
	active: boolean;

	@OneToMany(() => ExperiencePlayData, (playData) => playData.eventExperience)
	playData: ExperiencePlayData[];

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;
}
