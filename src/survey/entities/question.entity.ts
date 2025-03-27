import { Survey } from 'src/survey/entities/survey.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Option } from './option.entity';
import { SurveyAnswer } from './surveyAnswer.entity';

@Entity()
export class Question {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 500, nullable: false })
	question: string;

	@Column({ type: 'enum', enum: ['number', 'string'], nullable: false })
	type: 'number' | 'string';

	//* Relaciones
	@ManyToOne(() => Survey, (survey) => survey.questions, { eager: false })
	survey: Survey;

	@OneToMany(() => Option, (option) => option.question)
	options: Option[];

	@OneToMany(() => SurveyAnswer, (answer) => answer.question)
	answers: SurveyAnswer[];
}
