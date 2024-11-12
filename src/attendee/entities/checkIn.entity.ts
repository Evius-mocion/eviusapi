import { User } from "src/common/entities/user.entity";
import { Event } from "src/event/entities/event.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";


@Entity('checkIn')
export class Attendee {
    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Column({nullable: false,default: false})
    type: boolean;

    @Column({nullable: true,default: null})
    checkInAt: Date;

    @ManyToOne(() => User, user => user.attendees,{
        eager: true
    })
    user: User;
    @ManyToOne(() => Event, event => event.attendees, {
        eager: true
    })
    event: Event;

    @Column({nullable: true})
    country: string;

    @Column({nullable: true})
    plataform: string;

    @Column({nullable: true})
    browser: string;

    @CreateDateColumn()
    createAt: Date;
}
