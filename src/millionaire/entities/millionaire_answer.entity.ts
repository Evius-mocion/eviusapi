import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index, JoinColumn } from 'typeorm';
import { MillionaireQuestion } from './millionaire_question.entity';
import { MillionaireOption } from './millionaire_options.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';

@Entity()
export class MillionaireAnswer {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false})
    is_correct: boolean;


    @CreateDateColumn()
    created_at: Date;

    // relations
    @Index()
    @ManyToOne(() => Attendee, attendee => attendee.millionaireAnswers, {cascade: ["remove"]})
    @JoinColumn({name: "attendee_id", referencedColumnName: "id"})
    attendee: Attendee;

    @ManyToOne(() => MillionaireQuestion, question => question.answers, {cascade: ["remove"]})
    question: MillionaireQuestion;

    @ManyToOne(() => MillionaireOption, option => option.answers, {cascade: ["remove"]})
    selected_option: MillionaireOption;

}