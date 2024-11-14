import { Check, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Attendee } from "./attendee.entity"


@Entity('checkIn')
@Check(`("stationID" IS NOT NULL AND "experienceID" IS NULL) OR ("stationID" IS NULL AND "experienceID" IS NOT NULL)`)
export class CheckIn {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false, enum: ['station','cms', 'landing'] ,default: 'landing'})
    type: string;

    @ManyToOne(() => Attendee, attendee => attendee.checkIn ,{
        eager: true
    })
    Attendee: Attendee;
   
    @Column({nullable: true,})
    stationID: string;

    @Column({nullable: true,})
    experienceID: string;
   
    @CreateDateColumn()
    date: Date;
}
