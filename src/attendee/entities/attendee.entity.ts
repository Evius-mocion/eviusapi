import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';
import { Station } from 'src/stations/entities/station.entity';
import { User } from 'src/common/entities';
import { CheckInActivity } from './checkIn.entity';
import { CheckInType } from 'src/types/attendee.type';



@Entity('attendees')
export class Attendee {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	fullName: string;

	@ManyToOne(() => User, (user) => user.attendees, {
		eager: true,
	})
	user: User;

	@ManyToOne(() => Event, (event) => event.attendees, {
		eager: true,
	})
	event: Event;

	@Column({ nullable: true })
	country: string;

	@Column({ nullable: true })
	city: string;

	@Column({ nullable: true })
	plataform: string;

	@Column({ nullable: true })
	browser: string;

	@Column({ nullable: true })
	checkInAt: string;

	@ManyToOne(() => Station, (station) => station.attendees, {
		nullable: true,
	})
	station: Station;
	@OneToMany(() => CheckInActivity, (checkInActivity) => checkInActivity.Attendee)
	checkInActivity: CheckInActivity[];

	@Column({
		type: 'enum',
		enum: CheckInType,
		nullable: true,
	})
	checkInType: CheckInType;

	@CreateDateColumn()
	createAt: Date;
}
