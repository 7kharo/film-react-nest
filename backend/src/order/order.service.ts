import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from 'src/repository/order.repository';
import {
  FILM_REPOSITORY,
  IFilmRepository,
} from 'src/repository/film.repository';
import { SessionDto } from 'src/films/dto/films.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(FILM_REPOSITORY) private readonly filmRepository: IFilmRepository,
  ) {}
  async createOrder(dto: OrderDto) {
    const filmIds = [...new Set(dto.tickets.map((ticket) => ticket.film))];
    const scheduleCache = new Map<string, SessionDto[]>();
    for (const filmId of filmIds) {
      try {
        scheduleCache.set(
          filmId,
          await this.filmRepository.getIdSchedule(filmId),
        );
      } catch {
        throw new BadRequestException({
          message: 'Ошибка запроса к базе данных',
        });
      }
    }

    for (const ticket of dto.tickets) {
      const sessions = scheduleCache.get(ticket.film);
      const currentSession = sessions.find(
        (sched) => sched.id === ticket.session,
      );
      const rowSeat = `${ticket.row}:${ticket.seat}`;
      if (currentSession.taken.includes(rowSeat)) {
        throw new BadRequestException({
          message: `Место ${ticket.seat} ряд ${ticket.row} уже занято`,
        });
      } else {
        await this.filmRepository.addTakenPlace(
          ticket.film,
          ticket.session,
          ticket.row,
          ticket.seat,
        );
      }
    }
    const newOrder = await this.orderRepository.createOrder(dto);
    return {
      total: newOrder.length,
      items: newOrder,
    };
  }
}
