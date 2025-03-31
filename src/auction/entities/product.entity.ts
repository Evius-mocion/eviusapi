import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Auction } from "./auction.entity";
import { Bid } from "./bid.entity";

 
@Entity("auction_product")
 export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ nullable: false})
    name: string;

    @Column({ nullable: false})
    description: string;

    @Column({ nullable: false})
    image: string;

    @Column({ nullable: false})
    price: number;
    
    @CreateDateColumn()
    date: Date;

    //relaciones

    @ManyToOne(() => Auction, (auction) => auction.products)
    auction: Auction;

    @OneToMany(() => Bid, (bid) => bid.product)
    bids: Bid[];
}