import { Entity, Column, ManyToOne, CreateDateColumn, OneToMany, PrimaryColumn, JoinColumn, Generated, Index } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';
import { Station } from 'src/stations/entities/station.entity';
import { User } from 'src/common/entities';
import { CheckInActivity } from './checkIn.entity';
import { CheckInType } from 'src/types/attendee.type';
import { Bid } from 'src/auction/entities/bid.entity';
import { SurveyAnswer } from 'src/survey/entities/surveyAnswer.entity';

@Entity('attendees')
export class Attendee {
	@Index()
	@Column({ type: 'uuid', unique: true })
	@Generated('uuid')
	id: string;

	@Index()
	@PrimaryColumn({ type: 'uuid' })
	userId: string;

	@Index()
	@PrimaryColumn({ type: 'uuid' })
	eventId: string;

	@Column({ nullable: false })
	fullName: string;

	@Column({
		type: 'enum',
		enum: CheckInType,
		nullable: true,
	})
	origin: CheckInType;

	@Column({ nullable: false })
	email: string;

	@ManyToOne(() => User, (user) => user.attendees, {
		eager: false,
	})
	@JoinColumn({ name: 'userId' })
	user: User;

	@ManyToOne(() => Event, (event) => event.attendees, {
		eager: false,
	})
	@JoinColumn({ name: 'eventId' })
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
	station?: Station;

	@OneToMany(() => CheckInActivity, (checkInActivity) => checkInActivity.Attendee)
	checkInActivity: CheckInActivity[];

	@OneToMany(() => Bid, (bids) => bids.attende)
	bids: Bid[];

	@Column({
		type: 'enum',
		enum: CheckInType,
		nullable: true,
	})
	checkInType: CheckInType;

	@Column({ type: 'jsonb', nullable: true })
	properties: Record<string, any>;

	@CreateDateColumn({ type: 'timestamptz' })
	createAt: Date;

	@OneToMany(() => SurveyAnswer, (answer) => answer.attendee)
	answers: SurveyAnswer[];
}
