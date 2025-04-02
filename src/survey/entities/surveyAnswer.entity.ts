import { Question } from './question.entity';
import { Survey } from './survey.entity';
import { Option } from './option.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from 'src/attendee/entities/attendee.entity';

@Entity()
export class SurveyAnswer {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	//* Relaciones
	@ManyToOne(() => Survey, (survey) => survey.answers, { eager: false })
	survey: Survey;

	@ManyToOne(() => Question, (question) => question.answers, { eager: false })
	question: Question;

	@ManyToOne(() => Option, (option) => option, { nullable: true, eager: false })
	option: Option;

	@ManyToOne(() => Attendee, (attendee) => attendee.answers, { eager: false })
	attendee: Attendee;
}
