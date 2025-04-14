import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MillionaireQuestion } from './millionaire_question.entity';

@Entity()
export class MillionaireOption {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @ManyToOne(() => MillionaireQuestion, question => question.options)
    question: MillionaireQuestion;

    @Column()
    text: string;

    @Column()
    isCorrect: boolean;
}