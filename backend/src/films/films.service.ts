import { Inject, Injectable } from '@nestjs/common';
import {
  FILM_REPOSITORY,
  IFilmRepository,
} from 'src/repository/film.repository';
import dayjs from 'dayjs';

// const dayjs = require('dayjs');

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILM_REPOSITORY) private readonly filmRepository: IFilmRepository,
  ) {}
  async getFilms() {
    const films = await this.filmRepository.getFilms();
    return {
      total: films.length,
      items: films,
    };
  }

  async getScheduleFilms(id: string) {
    const schedule = (await this.filmRepository.getIdSchedule(id)).map(
      (sched) => {
        return {
          day: dayjs(sched.daytime).format('D MMMM'),
          time: dayjs(sched.daytime).format('HH:mm'),
          film: id,
          ...sched,
        };
      },
    );
    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
