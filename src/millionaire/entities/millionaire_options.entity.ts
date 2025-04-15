import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MillionaireQuestion } from './millionaire_question.entity';

@Entity()
export class MillionaireOption {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    text: string;
    
    @Column()
    isCorrect: boolean;
    
    // relations 
    @ManyToOne(() => MillionaireQuestion, question => question.options)
    question: MillionaireQuestion;
}