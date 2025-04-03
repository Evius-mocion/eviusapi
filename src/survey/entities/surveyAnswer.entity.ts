import { Question } from './question.entity';
import { Survey } from './survey.entity';
import { Option } from './option.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from 'src/attendee/entities/attendee.entity';

@Entity()
export class SurveyAnswer {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	//* Relaciones
	@ManyToOne(() => Survey, (survey) => survey.answers, { eager: false })
	survey: Survey;

	// Add to SurveyAnswer entity
	@ManyToOne(() => Question, (question) => question.surveyAnswers)
	question: Question;

	@ManyToOne(() => Option, (option) => option, { nullable: true, eager: false })
	option: Option;
	
	@ManyToOne(() => Attendee, (attendee) => attendee.answers, { eager: false })
	@JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
	attendee: Attendee;
}
