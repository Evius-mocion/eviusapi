import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	RelationId,
	UpdateDateColumn,
} from 'typeorm';
import { AdmissionTypes } from '../types/admissionType';
import { Event } from 'src/event/entities/event.entity';
import { MeetingConfig } from '../interfaces/networking.interface';
import { meetingConfigInitial } from '../constants/networking.constants';
import { NetworkingParticipant } from './networking-participant.entity';

@Entity('networking')
export class Networking {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	name: string;

	@Column({ type: 'text', default: '', nullable: true })
	description: string;

	@Column({ type: 'boolean', default: false })
	active: boolean;

	@Column({ type: 'timestamp' })
	opening_date: Date;

	@Column({ type: 'timestamp' })
	closing_date: Date;

	@Column({
		type: 'enum',
		enum: AdmissionTypes,
		default: AdmissionTypes.ALL,
	})
	admission_type: AdmissionTypes;

	@Column({ nullable: true })
	role_admission?: string;

	@OneToOne(() => Event, (event) => event.networking)
	@JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
	event: Event;

/* 	@RelationId((networking: Networking) => networking.event)
	eventId: string; */

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;

	@Column('jsonb', { nullable: true, default: () => `'${JSON.stringify(meetingConfigInitial)}'` })
	meeting_config: MeetingConfig;

	@OneToMany(() => NetworkingParticipant, (participant) => participant.networking)
	participants: NetworkingParticipant[];
}
