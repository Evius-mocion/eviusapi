import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Country } from "./country.entity";
import { City } from "./city.entity";

@Entity("department")
export class Department {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Country, (country) => country.states)
  country: Country;

  @Column()
  country_code: string;

  @Column({ nullable: true })
  iso2: string;

  @Column({ nullable: true })
  type: string;

  @Column({ type: "varchar", nullable: true })
  latitude: string;

  @Column({ type: "varchar", nullable: true })
  longitude: string;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
