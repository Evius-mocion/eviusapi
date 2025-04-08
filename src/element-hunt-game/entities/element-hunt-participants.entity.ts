import { Attendee } from 'src/attendee/entities/attendee.entity';
import { Column, CreateDateColumn, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ElementHuntGame } from './element-hunt-game.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ElementHuntSession } from './element-hunt-sessions.entity';
import { Entity } from 'typeorm';

@Entity()
@Index(['elementHuntGame', 'attendee'])
export class ElementHuntParticipant {
	@ApiProperty({ description: 'Unique identifier for the participant' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;
	@UpdateDateColumn({ type: 'timestamptz' })
	updated_at: Date;

	@ApiProperty({ description: 'Foreign key for the associated game' })
	@Column({ name: 'elementHuntGameId' })
	elementHuntGameId: string;

	//*-------------------------------- Relaciones -----------------------------

	@ApiProperty({ description: 'Sessions associated with the participant' })
	@OneToMany(() => ElementHuntSession, (elementHuntSession) => elementHuntSession.participant, { eager: false })
	elementHuntSessions: ElementHuntSession[];

	@ApiProperty({ description: 'Game associated with the participant' })
	@ManyToOne(() => ElementHuntGame, (elementHuntGame) => elementHuntGame.participants, { eager: false })
	elementHuntGame: ElementHuntGame;

	@ApiProperty({ description: 'Attendee associated with the participant' })
	@ManyToOne(() => Attendee, (attendee) => attendee.elementHuntParticipations, { eager: false })
	@JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
	attendee: Attendee;
}
