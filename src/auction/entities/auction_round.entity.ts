import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuctionStatusEnum } from "../interfaces";
import { Auction } from "./auction.entity";


@Entity('auction_rounds')   
export class AuctionRound {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    start_price: number;

    @Column({ nullable: false })
    current_price: number;

    @Column({ nullable: false, type: "timestamp with time zone" })
    start_time: Date;

    @Column({ nullable: false, type: "timestamp with time zone" })
    end_time: Date;

    @Column({ nullable: false, type: "enum", enum: AuctionStatusEnum, default: AuctionStatusEnum.PENDING })
    status: AuctionStatusEnum;

    @Column({ nullable: true })
    winner_id: string;

    // 🔵 Relaciones
    
    @ManyToOne(() => Auction, (auction) => auction.rounds)
    auction: Auction;

 

}