import { Attendee } from 'src/attendee/entities/attendee.entity';
import { Event } from 'src/event/entities/event.entity';
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

	@ManyToOne(() => Event, (event) => event.stations)
	event: Event;

	@OneToMany(() => Attendee, (attendee) => attendee.station, {
		nullable: true,
	})
	attendees?: Attendee[];
}
