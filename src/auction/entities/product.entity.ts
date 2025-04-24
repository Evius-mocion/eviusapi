import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auction } from "./auction.entity";
import { Bid } from "./bid.entity";
import { productStatusEnum } from "../interfaces";
import { AuctionRound } from "./auction_round.entity";

 
@Entity("auction_product")
 export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false})
    name: string;

    @Column({ nullable: false})
    description: string;

    @Column({ nullable: false})
    image: string;

    @Column({ nullable: false})
    price: number;

    @Column({ nullable: false})
    increment: number;

    @Column({ nullable: false, enum: productStatusEnum, default: productStatusEnum.AVAILABLE})
    status: productStatusEnum;

    @CreateDateColumn()
    date: Date;

    //relaciones

    @ManyToOne(() => Auction, (auction) => auction.products, { onDelete: "CASCADE", cascade: ["remove"] })
    auction: Auction;

    @OneToOne(()=> AuctionRound, (round) => round.product)
    round: AuctionRound;

    @OneToMany(() => Bid, (bid) => bid.product)
    bids: Bid[];
}