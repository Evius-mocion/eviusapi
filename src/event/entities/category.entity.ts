import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity('categories_events')
export class Categories {

    @PrimaryGeneratedColumn("uuid")
    id: string;
        
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, default: "without description" })
    description: string;

    @ManyToOne(() => Event, (event) => event.categories, {
        eager: false,
    })
    event: Event;
}