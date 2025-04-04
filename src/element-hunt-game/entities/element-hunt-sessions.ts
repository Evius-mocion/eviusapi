import { CreateDateColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ElementHuntParticipant } from './element-hunt-participants.entity';
import { HiddenPoints } from '../types/hidden-point';

export class ElementHuntSession {
	id: string;

	@ManyToOne(() => ElementHuntParticipant, (participant) => participant.elementHuntSession, { eager: false })
	@JoinColumn({ name: 'participantId', referencedColumnName: 'id' })
	participant: ElementHuntParticipant;

	@CreateDateColumn({ type: 'timestamptz' })
	start_time: Date;

	@Column({ type: 'timestamptz', nullable: true })
	end_time: Date;

	@Column({ type: 'jsonb', array: true, nullable: false })
	found_points: HiddenPoints[];
}
