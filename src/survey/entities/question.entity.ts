import { Survey } from 'src/survey/entities/survey.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Option } from './option.entity';
import { SurveyAnswer } from './surveyAnswer.entity';
import { QuestionType } from '../enums/question-type.enum';

@Entity()
export class Question {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 500, nullable: false })
	value: string;

	@Column({
		type: 'enum',
		enum: QuestionType,
		nullable: false,
	})
	type: QuestionType;

	@Column({ type: 'int', default: 0 })
	order: number;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;
	@UpdateDateColumn({ type: 'timestamptz' })
	updated_at: Date;

	//* Relaciones
	@ManyToOne(() => Survey, (survey) => survey.questions, { eager: false })
	survey: Survey;

	@OneToMany(() => Option, (option) => option.question)
	options: Option[];

	// Add to Question entity
	@OneToMany(() => SurveyAnswer, surveyAnswer => surveyAnswer.question)
	surveyAnswers: SurveyAnswer[];
}
