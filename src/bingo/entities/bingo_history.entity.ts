import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BingoRound } from "./bingo_round.entity";

@Entity("bingo_history")
export class BingoHistory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index()
    @ManyToOne(() => BingoRound, (round) => round.history)
    round: BingoRound;

    @Column({ nullable: false })
    cardId: string;

    @Column({ nullable: false })
    code: string;

    @Column({ nullable: true })
    attendee_id: string;

    @CreateDateColumn()
    created_at: Date;

}