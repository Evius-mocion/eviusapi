import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity("figures")
export class Figure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Nombre de la figura (por ejemplo, "Cartón Completo", "Esquinas", "L", etc.)

  @Column('simple-array')
  positions: string[]; // Posiciones en el cartón para la figura (por ejemplo, ["1,1", "1,2", "2,2", "3,1"] para esquinas)

}