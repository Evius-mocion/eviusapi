import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { MillionaireQuestion } from './millionaire_question.entity';

@Entity()
export class Millionaire {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false})
    name: string;

    @Column({ nullable: false, enum: ['active', 'inactive'], default: 'inactive'})
    status: string;

    @Column({ nullable: true})
    backgroundColor: string;

    @Column({ nullable: true})
    textColor: string;

    @Column({ nullable: true})
    logo: string;

    @Column({ nullable: false})
    rules: string;

    @OneToMany(() => MillionaireQuestion, question => question, {eager: true})
    questions: MillionaireQuestion[];
}