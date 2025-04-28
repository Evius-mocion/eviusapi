import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ExperienceCategoryEnum } from '../types/experience.type';

@Entity('experiences')
export class Experience {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false })
	name: string;

	@Column({ nullable: false })
	description: string;

	@Column({
		type: 'enum',
		enum: ExperienceCategoryEnum,
		nullable: false,
	})
	category: ExperienceCategoryEnum;

	@Column({ type: 'json', nullable: true })
	structure_definition: any;

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;
}
