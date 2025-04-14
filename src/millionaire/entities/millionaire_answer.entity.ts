import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MillionaireQuestion } from './millionaire_question.entity';
import { MillionaireOption } from './millionaire_options.entity';

@Entity()
export class MillionaireAnswer {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @ManyToOne(() => MillionaireQuestion, question => question.answers)
    question: MillionaireQuestion;

    @ManyToOne(() => MillionaireOption)
    selectedOption: MillionaireOption;

    @Column()
    isCorrect: boolean;
}