import { FilmsDto, SessionDto } from '../films/dto/films.dto';
import { IFilmRepository } from './film.repository';
import { Film } from 'src/films/entities/film.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from 'src/films/entities/schedule.entity';

export class PostgresFilmRepository implements IFilmRepository {
  constructor(
    @InjectRepository(Film) private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async getFilms(limit = 100, offset = 0): Promise<FilmsDto[]> {
    const films = await this.filmRepository.find({
      take: limit,
      skip: offset,
    });
    return films.map(({ schedule, tags, ...film }) => ({
      ...film,
      tags: tags,
    }));
  }

  async getFilmById(id: string): Promise<FilmsDto | null> {
    const film = await this.filmRepository.findOne({ where: { id } });
    if (!film) return null;
    return {
      ...film,
      tags: film.tags,
    };
  }

  async getIdSchedule(filmId: string): Promise<SessionDto[]> {
    const sessions = await this.scheduleRepository.find({ where: { filmId } });
    return sessions.map((s) => ({
      ...s,
      film: s.filmId,
      taken: s.taken || [],
    }));
  }

  async addTakenPlace(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<void> {
    const session = await this.scheduleRepository.findOne({
      where: { id: sessionId, filmId },
    });
    session.taken.push(`${row}:${seat}`);
    await this.scheduleRepository.save(session);
  }
}
