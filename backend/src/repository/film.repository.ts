import { FilmsDto, SessionDto } from 'src/films/dto/films.dto';

export const FILM_REPOSITORY = 'FILM_REPOSITORY';
export interface IFilmRepository {
  getFilms(): Promise<FilmsDto[]>;
  getFilmById(id: string): Promise<FilmsDto | null>;
  getIdSchedule(id: string): Promise<SessionDto[]>;
  addTakenPlace(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<void>;
}
