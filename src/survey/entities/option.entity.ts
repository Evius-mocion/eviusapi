import { Question } from './question.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('question_options') // Changed table name
export class Option {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	value: string;

	@Column({ default: false })
	isCorrect: boolean;

	//* Relaciones
	@ManyToOne(() => Question, (question) => question.options, { eager: false })
	question: Question;
}
