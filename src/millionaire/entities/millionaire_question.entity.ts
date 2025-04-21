import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { MillionaireOption } from './millionaire_options.entity';
import { MillionaireAnswer } from './millionaire_answer.entity';
import { Millionaire } from './millionaire.entity';

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

    //relations 

    @ManyToOne(() => Millionaire, millionaire => millionaire.questions, {cascade: ["remove"], onDelete: 'CASCADE'})
    millionaire: Millionaire;

    @OneToMany(() => MillionaireOption, option => option.question )
    options: MillionaireOption[];

    @OneToMany(() => MillionaireAnswer, answer => answer.question )
    answers: MillionaireAnswer[];
}