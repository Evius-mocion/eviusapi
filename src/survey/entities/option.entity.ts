import { Question } from './question.entity';
import { SurveyAnswer } from './surveyAnswer.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('question_options') // Changed table name
export class Option {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	value: string;

	@Column({ default: false })
	isCorrect: boolean;

	//* Relaciones
	@OneToMany(() => SurveyAnswer, (answer) => answer.option)
	surveyAnswers: SurveyAnswer[];

	@ManyToOne(() => Question, (question) => question.options, { eager: false })
	question: Question;
}
