import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { auctionCurrencyEnum, auctionStatusEnum } from "../interfaces";
import { Event } from "src/event/entities/event.entity";
import { Activity } from "src/activities/entities/activity.entity";
import { AuctionRound } from "./auction_round.entity";
import { Product } from "./product.entity";
import { Bid } from "./bid.entity";

@Entity("auction")
export class Auction {

    @Index()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false})
    name : string;
    
    @Column({ nullable: false})
    rules : string;

    @Column({ nullable: false, default: auctionStatusEnum.INACTIVE, enum: auctionStatusEnum})
    status: auctionStatusEnum;

    @Column({ nullable: false, enum: auctionCurrencyEnum, default: auctionCurrencyEnum.COP})
    currency: auctionCurrencyEnum;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


    // Relaciones  

    @Index()
    @ManyToOne(() => Event, (event) => event.auction)
	event: Event;
    
    @OneToOne(() => Activity, (activity) => activity.auction)
	@JoinColumn()
    activity: Activity;

    @OneToMany(() => AuctionRound, (station) => station.auction)
	rounds: AuctionRound[];

    @OneToMany(() => Product, (product) => product.auction)
	products: Product[];

    @OneToMany(() => Bid, (bid) => bid.auction)
    bids: Bid[];

}
