import { Option } from './option.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from 'src/attendee/entities/attendee.entity';
import { Question } from './question.entity';

@Entity()
export class SurveyAnswer {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	//* Relaciones mantenidas
	@ManyToOne(() => Option, (option) => option.surveyAnswers, { nullable: true, eager: false })
	option: Option;

	@ManyToOne(() => Attendee, (attendee) => attendee.answers, { eager: false })
	@JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
	attendee: Attendee;

	@Column({ nullable: true })
	response: string;

	@ManyToOne(() => Question, (question) => question.surveyAnswers)
	question: Question;
}
