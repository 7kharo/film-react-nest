import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmResponseDto, ScheduleResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  const mockFilmsService = {
    getFilms: jest.fn(),
    getScheduleFilms: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFilms', () => {
    it('should return films list', async () => {
      const expectedResponse: FilmResponseDto = {
        total: 2,
        items: [
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
        ],
      };

      mockFilmsService.getFilms.mockResolvedValue(expectedResponse);

      const result = await controller.getFilms();

      expect(result).toEqual(expectedResponse);
      expect(mockFilmsService.getFilms).toHaveBeenCalledTimes(1);
    });
  });

  describe('getIdSchedule', () => {
    it('should return schedule for given film id', async () => {
      const filmId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResponse: ScheduleResponseDto = {
        total: 1,
        items: [
          {
            id: 'sched-1',
            film: filmId,
            daytime: '2024-06-28T10:00:53+03:00',
            day: '28 июня',
            time: '10:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: [],
          },
        ],
      };

      mockFilmsService.getScheduleFilms.mockResolvedValue(expectedResponse);

      const result = await controller.getIdSchedule(filmId);

      expect(result).toEqual(expectedResponse);
      expect(mockFilmsService.getScheduleFilms).toHaveBeenCalledWith(filmId);
      expect(mockFilmsService.getScheduleFilms).toHaveBeenCalledTimes(1);
    });
  });
});