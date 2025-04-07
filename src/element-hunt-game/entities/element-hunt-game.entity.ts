import { Event } from 'src/event/entities/event.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HiddenPoints } from '../types/hidden-point';
import { ElementHuntParticipant } from './element-hunt-participants.entity';

@Entity()
export class ElementHuntGame {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	name: string;

	@Column({ type: 'varchar', nullable: false, default: '' })
	image_url: string;

	@Column({ type: 'int', nullable: false, default: 0 })
	image_width: number;

	@Column({ type: 'int', nullable: false, default: 0 })
	image_height: number;

	@Column({ type: 'text', nullable: false, default: '' })
	instruction: string;

	@Column({ type: 'int', nullable: false, default: 3 })
	max_attempts: number;

	@Column({ nullable: true, type: 'jsonb', default: [] })
	hidden_points: HiddenPoints[];

	//* ----------------------------- Relaciones -----------------------------

	@OneToOne(() => Event, (event) => event.elementHuntGame)
	@JoinColumn()
	event: Event;
	@OneToMany(() => ElementHuntParticipant, (participation) => participation.elementHuntGame)
	participants: ElementHuntParticipant[];
}
