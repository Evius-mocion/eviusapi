import { Column, Entity, ManyToMany, PrimaryGeneratedColumn,  } from "typeorm";
import { Event } from 'src/event/entities/event.entity';

@Entity('event_categories')
export class EventCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;
          
  @Column({ nullable: false })
  name: string;
  
  @Column({ nullable: false, default: "without description" })
  description: string;
  
  @ManyToMany(() => Event, (event) => event.categories, {
      eager: false,
  })
  event: Event;
}
