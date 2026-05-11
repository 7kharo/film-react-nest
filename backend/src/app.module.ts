import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { FILM_REPOSITORY } from './repository/film.repository';
import { ORDER_REPOSITORY } from './repository/order.repository';
import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';
import { PostgresFilmRepository } from './repository/postgres-film.repository';
import { Order } from './order/entities/order.entity';
import { PostgresOrderRepository } from './repository/postgres-order.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Film, Schedule, Order],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Film, Schedule, Order]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    { provide: FILM_REPOSITORY, useClass: PostgresFilmRepository }, // пока InMemory
    { provide: ORDER_REPOSITORY, useClass: PostgresOrderRepository }, // пока InMemory
  ],
})
export class AppModule {}
