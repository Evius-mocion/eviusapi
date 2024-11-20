import { Attendee } from 'src/attendee/entities/attendee.entity';
import { Event } from 'src/event/entities/event.entity';
import { Experience } from 'src/experiences/entities/experience.entity';
import { Participation } from 'src/participation/entities/participation.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stations')
export class Station {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    type: string;

    @Column({ nullable: false })
    representative: string;

    @Column({ nullable: false })
    location: string;

    @Column({ nullable: false, default: '' })
    country: string;

    @Column({ nullable: false, default: '' })
    department: string;

    @Column({ nullable: false, default: '' })
    city: string;

    @ManyToOne(() => Event, event => event.stations)
    event: Event;

    @ManyToOne(() => Experience, exp => exp.stations, {
        eager: true,
        nullable: true,
    })
    experience?: Experience;

    @OneToMany(() => Participation, participation => participation.station, {
        nullable: true
    })
    participations?: Participation[];

    @OneToMany(() => Attendee, attendee => attendee.station, {
        nullable: false
    })
    attendees?: Attendee[];
}
