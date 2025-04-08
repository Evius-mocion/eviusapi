import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { BingoRound } from './bingo_round.entity';

@Entity("figures")
export class Figure {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column('jsonb')
  positions: number[]; 

  // relations

  @OneToOne(() => BingoRound, (bingoRound) => bingoRound.figure)
  round: BingoRound;
}