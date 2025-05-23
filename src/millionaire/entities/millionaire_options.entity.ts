import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MillionaireQuestion } from './millionaire_question.entity';
import { MillionaireAnswer } from './millionaire_answer.entity';

@Entity()
export class MillionaireOption {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    text: string;
    
    @Column()
    is_correct: boolean;

       
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
    
    // relations 
    @ManyToOne(() => MillionaireQuestion, question => question.options, {cascade: ['remove'], onDelete: 'CASCADE'})
    question: MillionaireQuestion;

    @OneToMany(() => MillionaireAnswer, answer => answer.selected_option)
    answers: MillionaireAnswer[];
}