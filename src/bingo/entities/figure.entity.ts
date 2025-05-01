import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { BingoRound } from './bingo_round.entity';
import { FigureType } from '../interfaces';

@Entity("figures")
export class Figure {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({nullable: false})
  name: string;

  @Column({nullable: false, enum: FigureType})
  type: FigureType;


  @Column('jsonb')
  positions: number[]; 

  // relations

  @OneToOne(() => BingoRound, (bingoRound) => bingoRound.figure)
  round: BingoRound;
}