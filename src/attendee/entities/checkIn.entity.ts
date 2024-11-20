import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity('checkIn')
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
