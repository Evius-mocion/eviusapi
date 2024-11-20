import { Check, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity('checkIn')
@Check(`("stationID" IS NOT NULL AND "experienceID" IS NULL) OR ("stationID" IS NULL AND "experienceID" IS NOT NULL)`)
export class CheckInActivity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Attendee, (attendee) => attendee.checkInActivity, {
		eager: true,
	})
	Attendee: Attendee;

	@CreateDateColumn()
	date: Date;
}
