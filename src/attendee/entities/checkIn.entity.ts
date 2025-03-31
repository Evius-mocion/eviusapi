import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';
import { Activity } from 'src/activities/entities/activity.entity';

@Entity('CheckInActivity')
export class CheckInActivity {
	// 🟢 Columnas normales
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	date: Date;

	// 🔹 Relaciones
	@ManyToOne(() => Attendee, (attendee) => attendee.checkInActivity, {
		eager: true,
	})
	Attendee: Attendee;

	@ManyToOne(() => Activity, (activity) => activity.CheckIns, {
		eager: true,
	})
	Activity: Activity;

}
