import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Department } from "./department.entity";

@Entity("cities")
export class City {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude: string;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude: string;

  @ManyToOne(() => Department, (department) => department.cities)
  state: Department;

  @Column({ length: 2, nullable: true })
  country_code: string;

  @Column({ length: 2, nullable: true })
  state_code: string;
}
