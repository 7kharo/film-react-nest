import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { FilmsService } from '../films.service';

describe('FilmsController (e2e)', () => {
  let app: INestApplication;
  let filmsService: FilmsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/afisha');
    await app.init();

    filmsService = moduleFixture.get<FilmsService>(FilmsService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/afisha/films', () => {
    it('should return 200 and list of films', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/afisha/films')
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should return valid film structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/afisha/films')
        .expect(200);

      if (response.body.items.length > 0) {
        const film = response.body.items[0];
        expect(film).toHaveProperty('id');
        expect(film).toHaveProperty('title');
        expect(film).toHaveProperty('rating');
        expect(film).toHaveProperty('director');
        expect(film).toHaveProperty('tags');
        expect(film).toHaveProperty('about');
        expect(film).toHaveProperty('image');
        expect(film).toHaveProperty('cover');
        expect(film).not.toHaveProperty('schedule');
      }
    });
  });

  describe('GET /api/afisha/films/:id/schedule', () => {
    it('should return 200 for valid film id', async () => {
      const filmsResponse = await request(app.getHttpServer())
        .get('/api/afisha/films')
        .expect(200);

      if (filmsResponse.body.items.length > 0) {
        const filmId = filmsResponse.body.items[0].id;
        
        const response = await request(app.getHttpServer())
          .get(`/api/afisha/films/${filmId}/schedule`)
          .expect(200);

        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('items');
      }
    });

    it('should return 400 for invalid UUID format', async () => {
      await request(app.getHttpServer())
        .get('/api/afisha/films/invalid-id/schedule')
        .expect(400);
    });
  });
});