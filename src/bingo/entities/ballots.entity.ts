import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Bingo } from "./bingo.entity";

@Entity("ballots")
export class Ballots {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false,default: true, type: "boolean" })
    active: boolean;

    @Column({ nullable: false })
    value: number

    @Column({ nullable: true })
    image: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


    // relations
    @ManyToOne(() => Bingo, (bingo) => bingo.ballots)
    bingo: Bingo;
}