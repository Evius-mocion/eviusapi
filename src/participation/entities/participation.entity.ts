import { Attendee } from "src/attendee/entities/attendee.entity";
import { Experience } from "src/experiences/entities/experience.entity";
import { Station } from "src/stations/entities/station.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';



@Entity('participations')
export class Participation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    date: Date;

    @Column({nullable: true})
    points: number;

    @Column({
        nullable: false,
        type: "simple-json",
        default: {},
      })
      extra: object;

    @ManyToOne(() => Attendee, attendee => attendee.checkInActivity ,{
        eager: true
    })
    Attendee: Attendee;
   
	@ManyToOne(() => Experience, (exp) => exp.participations, {
		eager: true,
		nullable: true,
	})
	experience?: Experience;

	@ManyToOne(() => Station, (station) => station.participations, {
		eager: true,
		nullable: true,
	})
	station?: Station;

   
}
