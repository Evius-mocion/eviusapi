import { CreateDateColumn, Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ElementHuntParticipant } from './element-hunt-participants.entity';
import { HiddenPoints } from '../types/hidden-point';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class ElementHuntSession {
	@ApiProperty({ description: 'Unique identifier for the session' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ description: 'Participant associated with the session' })
	@ManyToOne(() => ElementHuntParticipant, (participant) => participant.elementHuntSession, { eager: false })
	@JoinColumn({ name: 'participantId', referencedColumnName: 'id' })
	participant: ElementHuntParticipant;

	@ApiProperty({ description: 'Start time of the session', type: Date })
	@CreateDateColumn({ type: 'timestamptz' })
	start_time: Date;

	@ApiProperty({ description: 'End time of the session', type: Date, nullable: true })
	@Column({ type: 'timestamptz', nullable: true })
	end_time: Date;

	@ApiProperty({ description: 'Points found during the session', type: [HiddenPoints] })
	@Column({ type: 'jsonb', array: true, nullable: false })
	found_points: HiddenPoints[];
}
