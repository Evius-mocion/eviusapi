import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MillionaireOption } from './millionaire_options.entity';
import { MillionaireAnswer } from './millionaire_answer.entity';

@Entity()
export class MillionaireQuestion {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    text: string;

    @Column({ type: 'boolean', nullable: false, default: false})
    check_point: boolean;

    @Column({ nullable: false})
    points: number;

    @Column({ nullable: false})
    order: number;

    @Column({ nullable: true})
    image: string; 

    @OneToMany(() => MillionaireOption, option => option.question, { eager: true})
    options: MillionaireOption[];

    @OneToMany(() => MillionaireAnswer, answer => answer.question, {eager: false})
    answers: MillionaireAnswer[];
}