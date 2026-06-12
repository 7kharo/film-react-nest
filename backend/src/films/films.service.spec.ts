import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import {
  FILM_REPOSITORY,
  IFilmRepository,
} from '../repository/film.repository';

describe('FilmsService', () => {
  let service: FilmsService;
  let filmRepository: IFilmRepository;

  const mockFilmRepository = {
    getFilms: jest.fn(),
    getFilmById: jest.fn(),
    getIdSchedule: jest.fn(),
    addTakenPlace: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FILM_REPOSITORY,
          useValue: mockFilmRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    filmRepository = module.get<IFilmRepository>(FILM_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFilms', () => {
    it('should return films with total count', async () => {
      const mockFilms = [
        {
          id: '1',
          rating: 8.5,
          director: 'Test Director',
          tags: ['Action'],
          title: 'Test Film',
          about: 'About test film',
          description: 'Description test film',
          image: '/image.jpg',
          cover: '/cover.jpg',
        },
      ];

      mockFilmRepository.getFilms.mockResolvedValue(mockFilms);

      const result = await service.getFilms();

      expect(result).toEqual({
        total: mockFilms.length,
        items: mockFilms,
      });
      expect(mockFilmRepository.getFilms).toHaveBeenCalledTimes(1);
    });
  });

  describe('getScheduleFilms', () => {
    it('should return schedule with formatted day and time', async () => {
      const filmId = 'test-film-id';
      const mockSchedule = [
        {
          id: 'sched-1',
          filmId: filmId,
          daytime: '2024-06-28T10:00:53+03:00',
          hall: 1,
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
      ];

      mockFilmRepository.getIdSchedule.mockResolvedValue(mockSchedule);

      const result = await service.getScheduleFilms(filmId);

      expect(result.total).toBe(1);
      expect(result.items[0]).toMatchObject({
        film: filmId,
        day: expect.any(String),
        time: expect.any(String),
      });
      expect(mockFilmRepository.getIdSchedule).toHaveBeenCalledWith(filmId);
    });
  });
});
