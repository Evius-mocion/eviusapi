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

@Entity('event_experience')
@Unique(['event', 'experience'])
export class EventExperience {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Event, (event) => event.id, { nullable: false })
	@Index()
	event: Event;

	@ManyToOne(() => Experience, { nullable: false })
	@Index()
	experience: Experience;

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
