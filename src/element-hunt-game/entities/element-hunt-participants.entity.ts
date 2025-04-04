import { Attendee } from 'src/attendee/entities/attendee.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { ElementHuntGame } from './element-hunt-game.entity';
import { ElementHuntSession } from './element-hunt-sessions';

export class ElementHuntParticipant {
	id: string;

	@ManyToOne(() => Attendee, (attendee) => attendee.elementHuntParticipations, { eager: false })
	@JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
	attendee: Attendee;

	@ManyToOne(() => ElementHuntGame, (elementHuntGame) => elementHuntGame.participants, { eager: false })
	@JoinColumn({ name: 'elementHuntGameId', referencedColumnName: 'id' })
	elementHuntGame: ElementHuntGame;

	@Column({ type: 'int', nullable: false })
	best_time: number;

	@Column({ type: 'int', nullable: false })
	attempts_left: number;

	@Column({ type: 'boolean', nullable: false })
	is_finish: boolean;

	@ManyToOne(() => ElementHuntSession, (elementHuntSession) => elementHuntSession.participant, { eager: false })
	@JoinColumn({ name: 'elementHuntSessionId', referencedColumnName: 'id' })
	elementHuntSession: ElementHuntSession;
}
