import { Question } from './question.entity';
import { Survey } from './survey.entity';
import { Option } from './option.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SurveyAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  attendee_id: string;

  @Column({ nullable: true })
  value: string;

  //* Relaciones
  @ManyToOne(() => Survey, (survey) => survey.answers, { eager: false })
  survey: Survey;

  @ManyToOne(() => Question, (question) => question.answers, { eager: false })
  question: Question;

  @ManyToOne(() => Option, (option) => option, { nullable: true, eager: false })
  option: Option;
}
