import { Activity } from "src/activities/entities/activity.entity";
import { Event } from "src/event/entities/event.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BingoCard } from "./bingo_card.entity";
import { IBoxStyle } from "../interfaces";
import { BingoRound } from "./bingo_round.entity";

@Entity("bingo")
export class Bingo {
    @Index()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: false})
    type: string;


    @Column({nullable: true})
    banner: string;

    @Column({nullable: true})
    footer: string;

    @Column({nullable: true})
    background_color: string;

    @Column({nullable: true})
    background_image: string;

    @Column({nullable: true})
    brands: string;

    @Column({nullable: false, type: "json", default: {}})
    box_styles: IBoxStyle;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    //relations 
    @Index()
    @ManyToOne(() => Event, event => event.bingos)
    event: Event;

    @OneToOne(() => Activity, (activity) => activity.bingo)
    @JoinColumn({ name: 'activity_id' , foreignKeyConstraintName: 'id'})
    activity: Activity;

    @OneToMany(() => BingoCard, (bingo_card) => bingo_card.bingo)
    cards: BingoCard[];
    
    @OneToMany(() => BingoRound, (bingo_round) => bingo_round.bingo,{cascade: ["remove"] , onDelete: 'CASCADE'})
    rounds: BingoRound[];

  
}
