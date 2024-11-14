import { User } from "src/common/entities/user.entity";
import { Event } from "src/event/entities/event.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CheckIn } from "./checkIn.entity";


@Entity('attendees')
export class Attendee {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    fullName: string;

    @ManyToOne(() => User, user => user.attendees,{
        eager: true
    })
    user: User;
    @ManyToOne(() => Event, event => event.attendees, {
        eager: true
    })
    event: Event;

    @OneToMany(() => CheckIn, checkIn => checkIn.Attendee)
    checkIn: CheckIn[];

    @Column({nullable: true})
    country: string;

    @Column({nullable: true})
    city: string;

    @Column({nullable: true})
    plataform: string;

    @Column({nullable: true})
    browser: string;

    @CreateDateColumn()
    createAt: Date;
}
