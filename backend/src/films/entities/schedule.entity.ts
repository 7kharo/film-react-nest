import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Film } from "./film.entity";

@Entity('schedules')
export class Schedule {
  @PrimaryColumn('uuid') id: string;
  @Column() daytime: string;
  @Column('int') hall: number;
  @Column('int') rows: number;
  @Column('int') seats: number;
  @Column('float') price: number;
  @Column('text') taken: string;
  @Column('uuid') filmId: string;
  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}