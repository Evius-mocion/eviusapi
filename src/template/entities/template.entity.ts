import { Event } from 'src/event/entities/event.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';

@Entity()
export class EmailTemplate {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	subject: string;

	@Column({ nullable: true })
	header: string;

	@Column({ default: false })
	showEventDate: boolean;

	@Column({ nullable: true })
	bodyImageUrl: string;

	@Column({ type: 'text', nullable: true })
	body: string;

	@Column({ nullable: true })
	footerImageUrl: string;

	@ManyToOne(() => Event, (event) => event.emailTemplates, {
		eager: false,
	})
	event: Event;

	@Index()
	@Column({ type: 'uuid', nullable: true })
	eventId: string;

	@Column({ type: 'boolean', default: false })
	isPredefined: boolean;
}
