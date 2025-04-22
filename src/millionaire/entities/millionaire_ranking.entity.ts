import { Attendee } from "src/attendee/entities/attendee.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Column, UpdateDateColumn, CreateDateColumn, Index } from 'typeorm';
import { Millionaire } from "./millionaire.entity";

@Entity()
export class MillionaireRanking{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    points: number;
    

    @Column({nullable: false})
    final_points: number;
    
    @Column({nullable: false})
    finished: boolean;    

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
    // relations
    @Index()
    @ManyToOne(() => Attendee, attendee => attendee.millionaireAnswers, {cascade: ["remove"]})
    @JoinColumn({name: "attendee_id", referencedColumnName: "id"})
    attendee: Attendee;

    @Index()
    @ManyToOne(() => Millionaire, millionaire => millionaire.ranking, {cascade: ["remove"], onDelete: 'CASCADE'})
    millionaire: Millionaire;

}