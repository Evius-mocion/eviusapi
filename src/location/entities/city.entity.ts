import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Department } from "./department.entity";
import { Country } from "./country.entity";

@Entity("cities")
export class City {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 10, nullable: true })
  country_code: string;

  @Column({ length: 10, nullable: true })
  state_code: string;

  @ManyToOne(() => Country, (country) => country.cities)
  country: Country;


  @ManyToOne(() => Department, (department) => department.cities)
  state: Department;
}
