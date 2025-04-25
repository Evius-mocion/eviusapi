import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm';
import { EventExperience } from './event-experience.entity';
import { Attendee } from 'src/attendee/entities/attendee.entity';

@Entity('experience_play_data')
@Unique(['eventExperience', 'attendee', 'play_timestamp'])
export class ExperiencePlayData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EventExperience, ee => ee.playData, { nullable: false })
  @Index()
  eventExperience: EventExperience;

  @ManyToOne(() => Attendee, { nullable: false })
  @Index()
  attendee: Attendee;

  @Column({ type: 'timestamp', nullable: false })
  play_timestamp: Date;

  @Column({ type: 'json', nullable: true })
  data: any;

  @Column({ type: 'boolean', default: false })
  is_agnostic: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}