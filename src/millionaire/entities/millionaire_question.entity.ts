import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
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
    stage: number;

    @Column({ nullable: true})
    image: string; 
    
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
    
    //relations 
    @Index()
    @ManyToOne(() => Millionaire, millionaire => millionaire.questions, {cascade: ["remove"], onDelete: 'CASCADE'})
    millionaire: Millionaire;

    @OneToMany(() => MillionaireOption, option => option.question )
    options: MillionaireOption[];

    @OneToMany(() => MillionaireAnswer, answer => answer.question )
    answers: MillionaireAnswer[];
}