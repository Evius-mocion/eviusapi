import { Entity, PrimaryGeneratedColumn, OneToMany, Column, OneToOne, JoinColumn, Index, ManyToOne } from 'typeorm';
import { MillionaireQuestion } from './millionaire_question.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { Event } from 'src/event/entities/event.entity';

@Entity()
export class Millionaire {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	name: string;

	@Column({ nullable: false, enum: ['active', 'inactive'], default: 'inactive' })
	status: string;

	@Column({ nullable: true })
	background_color: string;

	@Column({ nullable: true })
	text_color: string;

	@Column({ nullable: true })
	logo: string;

	@Column({ nullable: false })
	rules: string;

	//relations
	@Index()
	@ManyToOne(() => Event, (event) => event.bingos)
	event: Event;

	@OneToOne(() => Activity, (activity) => activity.millionaires)
	@JoinColumn({ name: 'activity_id', foreignKeyConstraintName: 'id' })
	activity: Activity;

	@OneToMany(() => MillionaireQuestion, (question) => question.millionaire, { eager: true })
	questions: MillionaireQuestion[];
}
