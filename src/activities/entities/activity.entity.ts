import { IContent, IDates } from 'src/types/event.type';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from './document';
import { Speaker } from './speaker.entity';
import { Event } from 'src/event/entities/event.entity';
import { Survey } from 'src/survey/entities/survey.entity';

@Entity('activities')
export class Activity {
	// 🔹 Columnas normales
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	name: string;

	@Column({ nullable: false, default: 'public', enum: ['public', 'scheduling'] })
	access: string;

	@Column({ nullable: true })
	longDescription: string;

	@Column({ nullable: true })
	shortDescription: string;

	@Column({ nullable: true })
	image: string;

	@Column({ nullable: true })
	imageMobile: string;

	@Column({ nullable: false, type: 'jsonb', default: [] })
	categories: string[];

	@Column({ nullable: true, type: 'jsonb' })
	contentConfig: IContent;

	@Column({ nullable: true })
	price: number;

	@Column({ nullable: false, type: 'jsonb' })
	dates: IDates[];

	@Column({ nullable: true, type: 'numeric' })
	capacity: number;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	// 🔹 Relaciones
	@OneToMany(() => Document, (document) => document.Activity, {
		eager: true,
	})
	documents: Document[];

	@OneToMany(() => Speaker, (speaker) => speaker.Activity, {
		eager: true,
	})
	speakers: Speaker[];

	@ManyToOne(() => Event, (event) => event.activities, {
		eager: false,
	})
	event: Event;

	@OneToMany(() => Survey, (survey) => survey.activity, {
		eager: false,
	})
	surveys: Survey[];
}
