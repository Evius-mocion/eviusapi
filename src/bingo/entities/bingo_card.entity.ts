import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IBoxValue } from "../interfaces";

@Entity("bingo_card")
export class BingoCard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true, type: "alphanum" })
    code: string;

    @Column({ nullable: false, type: "jsonb" })
    values: Array<Array<IBoxValue>>;

    @Column({ nullable: false,default: true, type: "boolean" })
    is_active: boolean;
}