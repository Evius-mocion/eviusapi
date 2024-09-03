import { Event } from 'src/event/entities/event.entity';
import { Station } from 'src/stations/entities/station.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('experiences')
export class Experience {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    name: string;
    
    @Column({nullable: false})
    description: string;

    @Column({nullable: false})
    category: string;

    @ManyToMany(() => Event, event => event.experiences) 
    events: Event[];

    @OneToMany(() => Station, station => station.experience, {
        nullable: true
    })
    stations?: Station[];

}
