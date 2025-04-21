import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MillionaireQuestion } from './millionaire_question.entity';
import { MillionaireOption } from './millionaire_options.entity';

@Entity()
export class MillionaireAnswer {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false})
    is_correct: boolean;

    @Column({nullable: false})
    points: number;

    // relations 

    @ManyToOne(() => MillionaireQuestion, question => question.answers, {cascade: ["remove"]})
    question: MillionaireQuestion;

    @ManyToOne(() => MillionaireOption, option => option.answers, {cascade: ["remove"]})
    selected_option: MillionaireOption;

}