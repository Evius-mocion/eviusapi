import { Event } from "src/event/entities/event.entity";
import { Experience } from "src/experiences/entities/experience.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('stations')
export class Station {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    description: string;

    @Column({nullable: false})
    type: string;

    @Column({nullable: false})
    representative: string;

    @Column({nullable: false})
    location: string;
    
    @ManyToOne(() => Event, event => event.stations)
    event: Event;

    @ManyToOne(() => Experience, exp => exp.stations , {
        eager: true,
        nullable: true
    })
    experience?: Experience;
}
