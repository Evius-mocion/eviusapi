import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuctionStatusRoundEnum } from "../interfaces";
import { Auction } from "./auction.entity";
import { Product } from "./product.entity";


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

    @Column({ nullable: false, type: "enum", enum: AuctionStatusRoundEnum, default: AuctionStatusRoundEnum.IN_PROGRESS })
    status: AuctionStatusRoundEnum;

    @Column({ nullable: true })
    winner_id: string;

    // 🔵 Relaciones
    
    @ManyToOne(() => Auction, (auction) => auction.rounds, { cascade: ['remove'], onDelete: 'CASCADE'})
    auction: Auction;

    @OneToOne(() => Product, (product) => product.round)
    @JoinColumn() // 
    product: Product;
}