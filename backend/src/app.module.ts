import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Films, filmsSchema } from './films/schemas/film.schema';
import { FILM_REPOSITORY } from './repository/film.repository';
import { ORDER_REPOSITORY } from './repository/order.repository';
import { MongoFilmRepository } from './repository/mongo-film.repository';
import { MongoOrderRepository } from './repository/mongo-order.repository';
import { Order, orderSchema } from './order/schemas/order.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([
      { name: Films.name, schema: filmsSchema },
      { name: Order.name, schema: orderSchema },
    ]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
    // @todo: Добавьте раздачу статических файлов из public
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    { provide: FILM_REPOSITORY, useClass: MongoFilmRepository },
    { provide: ORDER_REPOSITORY, useClass: MongoOrderRepository },
  ],
})
export class AppModule {}
