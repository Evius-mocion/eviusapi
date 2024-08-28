import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Department } from "./department.entity";

@Entity("countries")
export class Country {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  iso2: string;

  @Column()
  iso3: string;

  @Column()
  phonecode: string;

  @Column({ length: 100, nullable: true })
  capital: string;

  @Column()
  currency: string;

  @Column({ length: 100, nullable: true })
  native: string;

  @Column({ nullable: true })
  emoji: string;

  @OneToMany(() => Department, (department) => department.country)
  states: Department[];
}
