import { CreateDateColumn, Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ElementHuntParticipant } from './element-hunt-participants.entity';
import { HiddenPoints } from '../types/hidden-point';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ElementHuntSession {
	@ApiProperty({ description: 'Unique identifier for the session' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ description: 'Participant associated with the session' })
	@ManyToOne(() => ElementHuntParticipant, (participant) => participant.elementHuntSessions, { eager: false })
	@JoinColumn({ name: 'participantId', referencedColumnName: 'id' })
	participant: ElementHuntParticipant;

	@ApiProperty({ description: 'ID of the participant associated with the session' })
	@Column({ name: 'participantId' })
	participantId: string;

	@ApiProperty({ description: 'Start time of the session', type: Date })
	@CreateDateColumn({ type: 'timestamptz' })
	start_time: Date;

	@ApiProperty({ description: 'End time of the session', type: Date, nullable: true })
	@Column({ type: 'timestamptz', nullable: true })
	end_time: Date;

	@ApiProperty({ description: 'Points found during the session', type: [HiddenPoints] })
	@Column({ nullable: true, type: 'jsonb', default: [] })
	found_points: HiddenPoints[];

	@ApiProperty({ description: 'Number of remaining lives for the player', type: Number })
	@Column({ type: 'int', nullable: false })
	remaining_lives: number;

	@ApiProperty({ description: 'Indicates if the session is finished', type: Boolean })
	@Column({ type: 'boolean', default: false })
	finished: boolean;

	@UpdateDateColumn({ type: 'timestamptz' })
	updated_at: Date;
}
