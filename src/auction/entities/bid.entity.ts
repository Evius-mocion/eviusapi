import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Auction } from "./auction.entity";
import { Attendee } from "src/attendee/entities/attendee.entity";
import { AuctionRound } from "./auction_round.entity";

@Entity("auction_bids")
export class Bid {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false})
    name: string;
    
    @Column({ nullable: false})
    email: string;

    @Column({ nullable: false})
    amount: number;
    
    @CreateDateColumn()
    created_at: number;

    //Relaciones
    @ManyToOne(() => Product, (product) => product.bids)
    product: Product;

    @ManyToOne(() => Auction, (auction) => auction.bids)
    auction: Auction;
    
    @ManyToOne(() => Attendee, (attende) => attende.bids)
    attendee: Attendee;
    
    @ManyToOne(() => AuctionRound, (round) => round.bids)
    round: AuctionRound;

}