import { Event } from 'src/event/entities/event.entity';
import { Participation } from 'src/participation/entities/participation.entity';
import { Station } from 'src/stations/entities/station.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

    @ManyToOne(() => Event, event => event.experiences,{ nullable: false }) 
    event: Event;

    @OneToMany(() => Station, station => station.experience, {
        nullable: true
    })
    stations?: Station[];
    
    @OneToMany(() => Participation, participation => participation.experience, {
        nullable: true
    })
    participations?: Participation[];

}
