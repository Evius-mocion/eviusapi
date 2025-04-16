import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from 'typeorm';
import { AdmissionTypes } from '../types/admissionType';
import { Event } from 'src/event/entities/event.entity';

@Entity('networking')
export class Networking {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	name: string;

	@Column({ type: 'text', nullable: true })
	description: string;

	@Column({ type: 'boolean', default: true })
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
	role_admission: string;

	@Column({ default: true })
	chat_open: boolean;

	@Column({ default: false })
	enable_face_to_face_chat: boolean;

	@Column({ default: 10 })
	max_quantity_per_called: number;

	@Column({ type: 'int', default: 30 })
	meeting_time: number;

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;

	@OneToOne(() => Event, (event) => event.networking)
	@JoinColumn({ name: 'event_id' })
	event: Event;

	@RelationId((networking: Networking) => networking.event)
	eventId: string;
}
