import { Event } from "src/event/entities/event.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('event_sectors')
export class EventSector {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Event, (event) => event.sectors, {
    eager: false,
  })
  event: Event[];
}
