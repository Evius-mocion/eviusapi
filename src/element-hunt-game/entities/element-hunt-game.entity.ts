import { Event } from 'src/event/entities/event.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { HiddenPoints } from '../types/hidden-point';
import { ElementHuntParticipant } from './element-hunt-participants.entity';
import { DEFAULT_MAX_LIVES } from 'src/common/constants/elementHunt.constants';

@Entity()
export class ElementHuntGame {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	name: string;

	@Column({ type: 'uuid', nullable: false })
	@Index()
	eventId: string;

	@Column({ type: 'varchar', nullable: false, default: '' })
	image_url: string;

	@Column({ type: 'int', nullable: false, default: 0 })
	image_width: number;

	@Column({ type: 'int', nullable: false, default: 0 })
	image_height: number;

	@Column({ type: 'text', nullable: false, default: '' })
	instruction: string;

	@Column({ type: 'int', nullable: false, default: DEFAULT_MAX_LIVES })
	max_lives: number;

	@Column({ nullable: true, type: 'jsonb', default: [] })
	hidden_points: HiddenPoints[];

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;
	@UpdateDateColumn({ type: 'timestamptz' })
	updated_at: Date;

	//* ----------------------------- Relaciones -----------------------------

	@OneToOne(() => Event, (event) => event.elementHuntGame)
	@JoinColumn()
	event: Event;
	@OneToMany(() => ElementHuntParticipant, (participation) => participation.elementHuntGame)
	participants: ElementHuntParticipant[];
}
