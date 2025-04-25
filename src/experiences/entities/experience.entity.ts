import { Participation } from 'src/participation/entities/participation.entity';
import { Station } from 'src/stations/entities/station.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

	@OneToMany(() => Station, (station) => station.experience, {
		nullable: true,
	})
	stations?: Station[];

	@OneToMany(() => Participation, (participation) => participation.experience, {
		nullable: true,
	})
	participations?: Participation[];

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;
}
