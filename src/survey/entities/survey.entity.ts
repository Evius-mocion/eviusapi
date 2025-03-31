import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Activity } from 'src/activities/entities/activity.entity';
import { Event } from 'src/event/entities/event.entity';
import { Question } from 'src/survey/entities/question.entity';
import { SurveyAnswer } from './surveyAnswer.entity';

@Entity()
export class Survey {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 500, nullable: false })
	name: string;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;
	@UpdateDateColumn({ type: 'timestamptz' })
	updated_at: Date;

	//* Relaciones
	@ManyToOne(() => Event, (event) => event.surveys, { eager: false })
	event: Event;

	@ManyToOne(() => Activity, (activity) => activity.surveys, { eager: false })
	activity: Activity;

	@OneToMany(() => Question, (question) => question.survey)
	questions: Question[];

	@OneToMany(() => SurveyAnswer, (answer) => answer.survey)
	answers: SurveyAnswer[];
}
