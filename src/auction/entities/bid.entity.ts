import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Auction } from "./auction.entity";
import { Attendee } from "src/attendee/entities/attendee.entity";

@Entity("auction_bids")
export class Bid {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false})
    value: number;
    
    @CreateDateColumn()
    date: number;

    //Relaciones
    @ManyToOne(() => Product, (product) => product.bids)
    product: Product;

    @ManyToOne(() => Auction, (auction) => auction.bids)
    auction: Auction;
    
    @ManyToOne(() => Attendee, (attende) => attende.bids)
    attende: Attendee;

}