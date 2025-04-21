import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Bingo } from "./bingo.entity";
import { Attendee } from "src/attendee/entities/attendee.entity";

@Entity("bingo_card")
export class BingoCard {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, unique: true })
    code: string;

    @Column({ nullable: false, type: "jsonb" })
    values: number[];

    @Column({ nullable: false,default: true, type: "boolean" })
    is_active: boolean;

    @CreateDateColumn({ nullable: false })
    created_at: Date;

    @UpdateDateColumn({ nullable: false })
    updated_at: Date;

    // relations

    @ManyToOne(() => Bingo, (bingo) => bingo.cards, {cascade: ["remove"], onDelete: "CASCADE"})
    bingo: Bingo;

  @OneToOne(() => Attendee, (attendee) => attendee.bingoCard, { nullable: true, cascade: ["remove"] })
  @JoinColumn() 
  attendee?: Attendee;
}