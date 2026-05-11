import { InjectModel } from '@nestjs/mongoose';
import { FilmsDto, SessionDto } from '../films/dto/films.dto';
import { IFilmRepository } from './film.repository';
import { Films } from 'src/films/schemas/film.schema';
import { Model } from 'mongoose';

export class MongoFilmRepository implements IFilmRepository {
  constructor(@InjectModel(Films.name) private filmModel: Model<Films>) {}

  async getFilms(): Promise<FilmsDto[]> {
    const films = (await this.filmModel.find().lean()).map((film) => {
      delete film.schedule;
      return film;
    });
    return films;
  }

  async getFilmById(id: string): Promise<FilmsDto | null> {
    const film = await this.filmModel.findOne({ id }).lean();
    return film ?? null;
  }

  async getIdSchedule(id: string): Promise<SessionDto[]> {
    const film = await this.filmModel.findOne({ id }).lean();
    if (!!film) {
      return film.schedule;
    } else {
      return [];
    }
  }

  async addTakenPlace(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<void> {
    await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $push: { 'schedule.$.taken': `${row}:${seat}` } },
    );
  }
}
