import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	RelationId,
} from 'typeorm';
import { Networking } from './networking.entity';
import { MicrophoneMode } from '../interfaces/networking.interface';

@Entity('networking_space')
export class NetworkingSpace {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	name: string;

	@Column({ nullable: false })
	topic: string;

	@Column({ type: 'int', default: 0 })
	capacity: number;

	@Column({ type: 'timestamp', nullable: false })
	start_time: Date;

	@Column({ type: 'timestamp', nullable: false })
	end_time: Date;

	@Column('jsonb', { nullable: true })
	keywords: string[];

	@Column({
		type: 'enum',
		enum: MicrophoneMode,
		default: MicrophoneMode.OPEN,
	})
	microphone_mode: MicrophoneMode;

	@ManyToOne(() => Networking, (networking) => networking.id)
	@JoinColumn({ name: 'networking_id' })
	networking: Networking;

/* 	@RelationId((networkingSpace: NetworkingSpace) => networkingSpace.networking)
	networkingId: string; */

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;
}
