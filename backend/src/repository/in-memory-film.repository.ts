import { FilmsDto, SessionDto } from '../films/dto/films.dto';
import { IFilmRepository } from './film.repository';
import { FILMS_DATA } from './FILMS_DATA';

export class InMemoryFilmRepository implements IFilmRepository {
  private films = FILMS_DATA;

  async getFilms(): Promise<FilmsDto[]> {
    return this.films.map(({ schedule, ...film }) => film);
  }

  async getFilmById(id: string): Promise<FilmsDto | null> {
    return this.films.find((film) => film.id === id);
  }

  async getIdSchedule(id: string): Promise<SessionDto[]> {
    const film = this.films.find((film) => film.id === id);
    return film.schedule;
  }

  async addTakenPlace(
    _filmId: string,
    _sessionId: string,
    row: number,
    seat: number,
  ): Promise<void> {}
}
