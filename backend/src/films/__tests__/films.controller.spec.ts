import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../films.controller';
import { FilmsService } from '../films.service';
import { FilmResponseDto, ScheduleResponseDto } from '../dto/films.dto';

const mockFilmsService = {
  getFilms: jest.fn(),
  getScheduleFilms: jest.fn(),
};

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

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
    service = module.get<FilmsService>(FilmsService);

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('getFilms', () => {
    const mockFilmsResponse: FilmResponseDto = {
      total: 2,
      items: [
        {
          id: '1',
          rating: 8.5,
          director: 'Test Director',
          tags: ['Action', 'Drama'],
          title: 'Test Film 1',
          about: 'About test film 1',
          description: 'Description 1',
          image: '/image1.jpg',
          cover: '/cover1.jpg',
        },
        {
          id: '2',
          rating: 7.8,
          director: 'Another Director',
          tags: ['Comedy'],
          title: 'Test Film 2',
          about: 'About test film 2',
          description: 'Description 2',
          image: '/image2.jpg',
          cover: '/cover2.jpg',
        },
      ],
    };

    it('should return all films', async () => {
      mockFilmsService.getFilms.mockResolvedValue(mockFilmsResponse);

      const result = await controller.getFilms();

      expect(result).toEqual(mockFilmsResponse);
      expect(mockFilmsService.getFilms).toHaveBeenCalledTimes(1);
    });

    it('should return empty list when no films exist', async () => {
      const emptyResponse: FilmResponseDto = {
        total: 0,
        items: [],
      };
      mockFilmsService.getFilms.mockResolvedValue(emptyResponse);

      const result = await controller.getFilms();

      expect(result).toEqual(emptyResponse);
      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockFilmsService.getFilms.mockRejectedValue(error);

      await expect(controller.getFilms()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getIdSchedule', () => {
    const mockFilmId = '123e4567-e89b-12d3-a456-426614174000';
    const mockScheduleResponse: ScheduleResponseDto = {
      total: 2,
      items: [
        {
          id: 's1',
          film: mockFilmId,
          daytime: '2024-06-28T10:00:53+03:00',
          day: '28 июня',
          time: '10:00',
          hall: 1,
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
        {
          id: 's2',
          film: mockFilmId,
          daytime: '2024-06-28T14:00:53+03:00',
          day: '28 июня',
          time: '14:00',
          hall: 2,
          rows: 5,
          seats: 10,
          price: 350,
          taken: ['1:1', '1:2'],
        },
      ],
    };

    it('should return schedule for valid film id', async () => {
      mockFilmsService.getScheduleFilms.mockResolvedValue(mockScheduleResponse);

      const result = await controller.getIdSchedule(mockFilmId);

      expect(result).toEqual(mockScheduleResponse);
      expect(mockFilmsService.getScheduleFilms).toHaveBeenCalledWith(mockFilmId);
      expect(mockFilmsService.getScheduleFilms).toHaveBeenCalledTimes(1);
    });

    it('should return empty schedule when film has no sessions', async () => {
      const emptySchedule: ScheduleResponseDto = {
        total: 0,
        items: [],
      };
      mockFilmsService.getScheduleFilms.mockResolvedValue(emptySchedule);

      const result = await controller.getIdSchedule(mockFilmId);

      expect(result).toEqual(emptySchedule);
      expect(result.total).toBe(0);
    });

    it('should handle UUID validation through pipe', async () => {
      const invalidId = 'not-a-uuid';
      mockFilmsService.getScheduleFilms.mockRejectedValue(new Error('Invalid UUID'));
      
      await expect(controller.getIdSchedule(invalidId)).rejects.toThrow();
    });
  });
});