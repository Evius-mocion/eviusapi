import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from 'src/event/entities/event.entity';

@Entity('event_roles')
export class EventRole {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false})
    number: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true, default: 0 })
    price: number;

    @Column({ nullable: true, default: 0 })
    votingPoints: number;

    @ManyToOne(() => Event, (event) => event.eventRoles, {
        eager: false,
    })
    event: Event;
}
