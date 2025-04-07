import { Attendee } from 'src/attendee/entities/attendee.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ElementHuntGame } from './element-hunt-game.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ElementHuntSession } from './element-hunt-sessions';
import { Entity } from 'typeorm';

@Entity() // <-- Agregar este decorador
export class ElementHuntParticipant {
	@ApiProperty({ description: 'Unique identifier for the participant' })
  @PrimaryGeneratedColumn("uuid")
  id: string;

	@ApiProperty({ description: 'Attendee associated with the participant' })
	@ManyToOne(() => Attendee, (attendee) => attendee.elementHuntParticipations, { eager: false })
	@JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
	attendee: Attendee;

	@ApiProperty({ description: 'Game associated with the participant' })
	@ManyToOne(() => ElementHuntGame, (elementHuntGame) => elementHuntGame.participants, { eager: false })
	elementHuntGame: ElementHuntGame;

	@ApiProperty({ description: 'Best time achieved by the participant', type: Number })
	@Column({ type: 'int', nullable: false })
	best_time: number;

	@ApiProperty({ description: 'Attempts left for the participant', type: Number })
	@Column({ type: 'int', nullable: false })
	attempts_left: number;

	@ApiProperty({ description: 'Indicates if the participant has finished the game', type: Boolean })
	@Column({ type: 'boolean', nullable: false })
	is_finish: boolean;

	@ApiProperty({ description: 'Session associated with the participant' })
	@ManyToOne(() => ElementHuntSession, (elementHuntSession) => elementHuntSession.participant, { eager: false })
	elementHuntSession: ElementHuntSession;
}
