import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MillionaireOption } from './millionaire_options.entity';
import { MillionaireAnswer } from './millionaire_answer.entity';

@Entity()
export class MillionaireQuestion {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    text: string;

    @OneToMany(() => MillionaireOption, option => option.question)
    options: MillionaireOption[];

    @OneToMany(() => MillionaireAnswer, answer => answer.question)
    answers: MillionaireAnswer[];
}