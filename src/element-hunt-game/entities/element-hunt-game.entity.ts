import { Event } from 'src/event/entities/event.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HiddenPoints } from '../types/hidden-point';
import { ElementHuntParticipant } from './element-hunt-participants.entity';

@Entity()
export class ElementHuntGame {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	name: string;

	@Column({ type: 'varchar', nullable: false })
	image_url: string;

	@Column({ type: 'int', nullable: false })
	image_width: number;

	@Column({ type: 'int', nullable: false })
	image_height: number;

	@Column({ type: 'text', nullable: false })
	instruction: string;

	@Column({ type: 'int', nullable: false })
	max_attempts: number;

	@Column({ type: 'jsonb', array: true, nullable: false })
	hidden_points: HiddenPoints[];

	//* ----------------------------- Relaciones -----------------------------
	@OneToMany(() => Event, (event) => event.elementHuntGames)
	event: Event;
	@OneToMany(() => ElementHuntParticipant, (participation) => participation.elementHuntGame)
	participants: ElementHuntParticipant[];
}
