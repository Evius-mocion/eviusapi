import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Bingo } from "./bingo.entity";
import { StatusRoundBingo } from "../interfaces";
import { Figure } from "./figure.entity";

@Entity("bingo_round")
export class BingoRound {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, enum: StatusRoundBingo, default: StatusRoundBingo.active})
    status: StatusRoundBingo;
      
    @CreateDateColumn({ nullable: false })
    created_at: Date;

    @UpdateDateColumn({ nullable: false })
    updated_at: Date;

    @Column({ nullable: false, type: "jsonb" })
    winners: object[];
    
    @Column({ nullable: false })
    currentBallot: number;

    @Column({ nullable: false, type: "jsonb" })
    ballots: number[];
    
    @Column({ nullable: false, type: "jsonb" })
    ballotsPlayed: number[];

    // relations

    @ManyToOne(() => Bingo, (bingo) => bingo.cards)
    bingo: Bingo;

    @OneToOne(() => Figure, (figure) => figure.round)
    @JoinColumn()
    figure: Figure;
}